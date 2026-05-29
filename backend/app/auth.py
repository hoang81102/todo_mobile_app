from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app import schemas
from app.database import get_users_col
from app.models import serialize
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ─── Password ────────────────────────────────────────────────────────────────

def verify_password(plain: str, hashed: str) -> bool:
    """
    Thử bcrypt trước. Nếu không phải bcrypt hash (dữ liệu cũ plaintext)
    thì so sánh trực tiếp để tương thích ngược với data hiện có.
    """
    # Kiểm tra có phải bcrypt hash không ($2b$ hoặc $2a$)
    if hashed.startswith("$2"):
        return pwd_context.verify(plain, hashed)
    # Dữ liệu cũ: so sánh trực tiếp (plaintext)
    return plain == hashed


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# ─── JWT ─────────────────────────────────────────────────────────────────────

def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# ─── DB helpers ──────────────────────────────────────────────────────────────

async def get_user_by_email(email: str) -> Optional[dict]:
    doc = await get_users_col().find_one({"email": email})
    return serialize(doc) if doc else None


async def get_user_by_id(user_id: str) -> Optional[dict]:
    from bson import ObjectId
    if not ObjectId.is_valid(user_id):
        return None
    doc = await get_users_col().find_one({"_id": ObjectId(user_id)})
    return serialize(doc) if doc else None


async def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = await get_user_by_email(email)
    if not user:
        return None
    stored_hash = user.get("passwordHash", "")
    if not verify_password(password, stored_hash):
        return None
    return user


# ─── FastAPI dependencies ─────────────────────────────────────────────────────

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exc
    except JWTError:
        raise credentials_exc

    user = await get_user_by_id(user_id)
    if not user:
        raise credentials_exc
    return user
