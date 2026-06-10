import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_alert_email(email: str, username: str, subject: str, body: str):
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    print(f"[Email Service] Sending alert email to {email} ({username})")
    print(f"--- Subject: {subject} ---")
    print(body)
    print("--------------------------------------------------")
    
    if smtp_username and smtp_password:
        try:
            msg = MIMEMultipart()
            msg["From"] = smtp_username
            msg["To"] = email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))
            
            server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
            server.quit()
            print(f"[Email Service] Real email successfully sent to {email}")
        except Exception as e:
            print(f"[Email Service] Failed to send real email to {email}: {str(e)}")

def send_stranger_alert(email: str, username: str, home_name: str, image_url: str):
    subject = f"[YoloHome Alert] Stranger Detected at {home_name}"
    body = f"""Hi {username},

An unknown person (Stranger) has been detected at your home '{home_name}'.

Image URL: {image_url}

Please review your Smart Door dashboard for details.

Best regards,
YoloHome Security System
"""
    send_alert_email(email, username, subject, body)

def send_earthquake_alert(email: str, username: str, home_name: str):
    subject = f"[YoloHome EMERGENCY] Earthquake Detected at {home_name}"
    body = f"""Hi {username},

WARNING: An earthquake has been detected at your home '{home_name}'!

Please take immediate safety precautions and check on your family members.

Best regards,
YoloHome Security System
"""
    send_alert_email(email, username, subject, body)
