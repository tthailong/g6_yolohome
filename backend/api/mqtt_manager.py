import paho.mqtt.client as mqtt
import json
import asyncio
import threading
import os
import time
from socket_manager import manager as socket_manager
from sqlalchemy.orm import Session
import models

# Store the main event loop to use for broadcasting from other threads
main_loop = None
mqtt_lock = threading.Lock()

confirmations_lock = threading.Lock()
pending_confirmations = {}

def set_main_loop(loop):
    global main_loop
    main_loop = loop

def wait_for_mqtt_confirmation(home_id: int, feed_key: str, value: str, timeout: float = 5.0) -> bool:
    event = threading.Event()
    conf_key = (home_id, feed_key, str(value).strip())
    
    with confirmations_lock:
        pending_confirmations[conf_key] = event
        
    try:
        # Wait for the event to be set by the on_message thread
        completed = event.wait(timeout=timeout)
        return completed
    finally:
        with confirmations_lock:
            pending_confirmations.pop(conf_key, None)

class AdafruitMQTTClient:
    def __init__(self, home_id: int, username: str = None, key: str = None):
        self.home_id = home_id
        
        # Fallback to environment variables if not provided or set to placeholders
        env_username = os.getenv("ADAFRUIT_IO_USERNAME")
        env_key = os.getenv("ADAFRUIT_IO_KEY")

        self.username = username.strip() if username and username != "YOUR_ADAFRUIT_IO_USERNAME" else (env_username or "")
        self.key = key.strip() if key and key != "YOUR_ADAFRUIT_IO_KEY" else (env_key or "")

        # Use a stable client ID for the home to ensure new connections replace old ones
        # This prevents hitting Adafruit IO's 2-connection limit during reloads.
        client_id = f"G6YoloHome_Home_{home_id}"
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=client_id)
        self.client.username_pw_set(self.username, self.key)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.feeds = []

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            print(f"DEBUG: Connected to Adafruit MQTT for Home {self.home_id}")
            for feed in self.feeds:
                topic = f"{self.username}/feeds/{feed}"
                client.subscribe(topic)
                print(f"DEBUG: Subscribed to {topic}")
                # Small delay to avoid burst limits
                time.sleep(0.1)
        else:
            print(f"DEBUG: Failed to connect to Adafruit MQTT for Home {self.home_id}, rc: {rc}")

    def on_message(self, client, userdata, msg):
        try:
            payload = msg.payload.decode()
            feed_key = msg.topic.split('/')[-1]
            print(f"DEBUG: Received message on {msg.topic}: {payload}")
            
            # Check for any pending HTTP request waiting for this specific confirmation
            conf_key = (self.home_id, feed_key, payload.strip())
            with confirmations_lock:
                if conf_key in pending_confirmations:
                    print(f"DEBUG: Confirming pending control request for key: {conf_key}")
                    pending_confirmations[conf_key].set()
            
            # Check for earthquake detection and trigger email alerts BEFORE sending to frontend
            if feed_key == "dadn.earthquake-detected" and payload != "0" and payload.strip() != "":
                print(f"DEBUG: Earthquake detected on Home {self.home_id}! Initiating background email alerts...")
                threading.Thread(
                    target=send_earthquake_alert_to_home_members,
                    args=(self.home_id,),
                    daemon=True
                ).start()

            # Broadcast to WebSockets
            message = {
                "type": "SENSOR_UPDATE",
                "feed_name": feed_key,
                "value": payload,
                "timestamp": None # Could add if needed
            }
            # Since on_message is called from the paho thread, we need to handle the event loop thread-safely
            if main_loop:
                main_loop.call_soon_threadsafe(
                    lambda: asyncio.create_task(socket_manager.broadcast_to_home(self.home_id, message))
                )
            else:
                print(f"DEBUG: No main loop set, cannot broadcast message")
                
        except Exception as e:
            print(f"DEBUG: Error in on_message: {str(e)}")

    def start(self, feeds: list):
        self.feeds = feeds
        # Use connect_async to avoid blocking the FastAPI event loop
        # Increased keepalive to 120 for stability
        self.client.connect_async("io.adafruit.com", 1883, 120)
        self.client.loop_start()

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

    def publish(self, feed_key: str, value: str):
        topic = f"{self.username}/feeds/{feed_key}"
        self.client.publish(topic, value)
        print(f"DEBUG: Published to {topic}: {value}")

# Registry to keep track of active MQTT clients
active_mqtt_clients = {}

def ensure_mqtt_for_home(home_id: int, db: Session):
    with mqtt_lock:
        if home_id in active_mqtt_clients:
            return active_mqtt_clients[home_id]
        
        home = db.query(models.Home).filter(models.Home.id == home_id).first()
        if not home:
            print(f"DEBUG: Home {home_id} not found for MQTT initialization")
            return None
            
        sensors = db.query(models.Sensor).join(models.Device).filter(models.Device.home_id == home.id).all()
        if not sensors:
            print(f"DEBUG: No sensors found for Home {home.name}, skipping MQTT")
            return None
            
        feeds = [s.feed_name for s in sensors]
        client = AdafruitMQTTClient(home.id, home.adafruitiouser, home.adafruitiokey)
        client.start(feeds)
        active_mqtt_clients[home.id] = client
        print(f"DEBUG: Initialized MQTT for Home {home.name} on-demand with feeds: {feeds}")
        return client

def stop_all_mqtt():
    for client in active_mqtt_clients.values():
        client.stop()
    active_mqtt_clients.clear()

def send_earthquake_alert_to_home_members(home_id: int):
    try:
        from database import SessionLocal
        from email_utils import send_earthquake_alert
        db = SessionLocal()
        try:
            # Query all active members of this home
            members = db.query(models.User).join(
                models.UserHome, models.User.id == models.UserHome.user_id
            ).filter(
                models.UserHome.home_id == home_id,
                models.UserHome.status == models.UserHomeStatus.accepted
            ).all()
            
            home_obj = db.query(models.Home).filter(models.Home.id == home_id).first()
            home_name = home_obj.name if home_obj else f"Home {home_id}"
            
            for member in members:
                send_earthquake_alert(
                    email=member.email,
                    username=member.username,
                    home_name=home_name
                )
        finally:
            db.close()
    except Exception as e:
        print(f"DEBUG: Error sending earthquake alert: {str(e)}")
