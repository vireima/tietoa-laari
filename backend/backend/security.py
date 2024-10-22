from cryptography.fernet import Fernet

KEY = b"68xSV3zawgy1mDY6Z9kxzmIqYQR73LSxIBhGVKol4ds="
SUITE = Fernet(KEY)


def encrypt(data: str) -> str:
    return SUITE.encrypt(data.encode()).decode()


def decrypt(data: str) -> str:
    return SUITE.decrypt(data).decode()
