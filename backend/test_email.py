from email_service import send_otp_email

receiver = input("Enter your Gmail address: ")

try:
    send_otp_email(receiver, "123456")
    print("Test Email Sent Successfully!")
except Exception as e:
    print("Email Error:", e)