from cryptography.fernet import Fernet, InvalidToken

KEY = b"68xSV3zawgy1mDY6Z9kxzmIqYQR73LSxIBhGVKol4ds="
SUITE = Fernet(KEY)


def encrypt(data: str) -> str:
    if not isinstance(data, str):
        raise TypeError(f"attempting to encrypt {type(data)}, not str")

    if not data:
        raise ValueError("attempting to encrypt empty string")

    return SUITE.encrypt(data.encode()).decode()


def decrypt(data: str) -> str:
    if not isinstance(data, str):
        raise TypeError(f"attempting to decrypt {type(data)}, not str")

    if not data:
        raise ValueError("attempting to decrypt empty string")

    try:
        return SUITE.decrypt(data).decode()
    except InvalidToken:
        raise ValueError(f"attempting to decrypt invalid token: {data}") from None
    except TypeError as err:
        # Should not happen, raised when data is not bytes or str
        raise err from None
