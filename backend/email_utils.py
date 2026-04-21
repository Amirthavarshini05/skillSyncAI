import smtplib
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "alfredsam2006@gmail.com"
SENDER_PASSWORD = "gvun gfyq wppm vzzr"

def send_email_sync(recipient_email, otp):
    """Synchronous function to send email."""
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = recipient_email
        msg['Subject'] = "Your SkillSync OTP Verification Code"

        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; rounded-lg: 10px;">
                <h2 style="color: #2563eb; text-align: center;">SkillSync AI Verification</h2>
                <p>Hello,</p>
                <p>Thank you for registering with SkillSync AI. To complete your signup, please use the following One-Time Password (OTP):</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; background: #f0f7ff; padding: 10px 20px; border-radius: 5px;">{otp}</span>
                </div>
                <p>This code will expire shortly. If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 SkillSync AI. All rights reserved.</p>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, recipient_email, text)
        server.quit()
        print(f"OTP Email sent successfully to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

def delayed_email_send(recipient_email, otp):
    """Function to be run in a background thread with a 5s delay."""
    time.sleep(5)
    send_email_sync(recipient_email, otp)

def send_otp_email(recipient_email, otp):
    """Triggers the background thread for delayed email sending."""
    thread = threading.Thread(target=delayed_email_send, args=(recipient_email, otp))
    thread.start()
