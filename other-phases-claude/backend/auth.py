from fastapi import Header, HTTPException
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()
NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET")
ALGORITHM = "HS256"

if not NEXTAUTH_SECRET:
    raise RuntimeError("NEXTAUTH_SECRET is not set")

def get_current_user(authorization: str = Header(None)):
    """
    Dependency to get the currently authenticated user.
    Expects a Bearer token in the Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, NEXTAUTH_SECRET, algorithms=[ALGORITHM])
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_email
    except Exception:
        raise HTTPException(status_code=401, detail="Token verification failed")
