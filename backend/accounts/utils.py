
import pyotp
import qrcode
import io
import base64
import random
import string

def generate_totp_secret():
	return pyotp.random_base32()

def get_totp_uri(secret, username, issuer_name="ReadingGroup"):
	return pyotp.totp.TOTP(secret).provisioning_uri(
		name=username, issuer_name=issuer_name
	)

def generate_qr_code_base64(uri):
	qr = qrcode.make(uri)
	buffered = io.BytesIO()
	qr.save(buffered, format="PNG")
	img_base64 = base64.b64encode(buffered.getvalue()).decode()
	return f"data:image/png;base64,{img_base64}"

def generate_password():
	return "".join(
		random.choice(string.ascii_letters + string.digits) for _ in range(12)
	)
