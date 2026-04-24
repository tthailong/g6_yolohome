import paho.mqtt.client as mqtt
import json
from socket_manager import manager as socket_manager
from sqlalchemy.orm import Session
import models

class AdafruitMQTTClient:
    def __init__(self, home_id: int, username: str, key: str):
        self.home_id = home_id
        self.username = username.strip() if username else ""
        self.key = key.strip() if key else ""
        # Use a unique client ID for each home connection
        client_id = f"G6YoloHome_Client_{home_id}"
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
        else:
            print(f"DEBUG: Failed to connect to Adafruit MQTT for Home {self.home_id}, rc: {rc}")

    def on_message(self, client, userdata, msg):
        try:
            payload = msg.payload.decode()
            feed_key = msg.topic.split('/')[-1]
            print(f"DEBUG: Received message on {msg.topic}: {payload}")
            
            # Broadcast to WebSockets
            import asyncio
            message = {
                "type": "SENSOR_UPDATE",
                "feed_name": feed_key,
                "value": payload,
                "timestamp": None # Could add if needed
            }
            # Since on_message is called from the paho thread, we need to handle the event loop
            try:
                loop = asyncio.get_running_loop()
                loop.create_task(socket_manager.broadcast_to_home(self.home_id, message))
            except RuntimeError:
                # No running loop, or called from different context
                asyncio.run(socket_manager.broadcast_to_home(self.home_id, message))
                
        except Exception as e:
            print(f"DEBUG: Error in on_message: {str(e)}")

    def start(self, feeds: list):
        self.feeds = feeds
        self.client.connect("io.adafruit.com", 1883, 60)
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
