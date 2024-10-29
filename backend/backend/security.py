from datetime import datetime, timedelta

import jose.constants
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from jose import jwt
from jose.constants import ALGORITHMS

from backend.config import settings

SUITE = Fernet(settings.fernet_key)


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


def generate_rsa_keys():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

    unencrypted_pem_private_key = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    pem_public_key = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    return (unencrypted_pem_private_key.decode(), pem_public_key.decode())


def jwt_encode(
    client_id: str, at_hash: str, exp: timedelta = timedelta(days=60)
) -> str:
    # Claims: https://www.iana.org/assignments/jwt/jwt.xhtml
    claims = {
        "client_id": client_id,
        "iss": f"https://{settings.frontend_url}",
        "at_hash": at_hash,
        "exp": datetime.now() + exp,
        "iat": datetime.now(),
    }
    return jwt.encode(claims, settings.rsa_pem_private_key, algorithm=ALGORITHMS.RS256)


def jwt_decode(token: str):
    return jwt.decode(
        token,
        settings.rsa_pem_public_key,
        algorithms=[ALGORITHMS.RS256],
        issuer=f"https://{settings.frontend_url}",
        options={"verify_at_hash": False},
    )
