
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


def send_otp_email(receiver_email, otp):

    sender_email = os.getenv("EMAIL_USER")
    app_password = os.getenv("EMAIL_APP_PASSWORD")

    if not sender_email or not app_password:
        raise ValueError("Email configuration is missing in .env")

    message = EmailMessage()
    message["Subject"] = "CampusConnect - Password Reset OTP"
    message["From"] = sender_email
    message["To"] = receiver_email

    message.set_content(f"""
Hello Admin,

Your CampusConnect password reset OTP is: {otp}

This OTP is valid for 5 minutes.
Do not share this OTP with anyone.

Regards,
CampusConnect Team
""")

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, app_password)
        server.send_message(message)

    return True
