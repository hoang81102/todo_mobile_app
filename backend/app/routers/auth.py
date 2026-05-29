from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from app import schemas
from app.auth import (
    authenticate_user,
    create_access_token,
    hash_password,
    get_user_by_email,
    get_current_user,
    serialize,
)
from app.database import get_users_col
from app.models import to_object_id

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def register(body: schemas.UserRegister):
    """Đăng ký tài khoản mới."""
    if await get_user_by_email(body.email):
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")

    users = get_users_col()
    doc = {
        "fullName": body.fullName,
        "email": body.email,
        "passwordHash": hash_password(body.password),
        "createdAt": datetime.utcnow(),
    }
    result = await users.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return schemas.UserOut(**doc)


@router.post("/login", response_model=schemas.Token)
async def login(body: schemas.UserLogin):
    """Đăng nhập bằng email + password."""
    user = await authenticate_user(body.email, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng",
        )
    token = create_access_token(user_id=user["id"])
    return schemas.Token(access_token=token)


@router.get("/me", response_model=schemas.UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Lấy thông tin user đang đăng nhập."""
    return schemas.UserOut(**current_user)


@router.put("/me", response_model=schemas.UserOut)
async def update_me(
    body: schemas.UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Cập nhật profile."""
    updates = body.model_dump(exclude_unset=True)
    if not updates:
        return schemas.UserOut(**current_user)

    users = get_users_col()
    oid = to_object_id(current_user["id"])
    await users.update_one({"_id": oid}, {"$set": updates})
    updated = await users.find_one({"_id": oid})
    return schemas.UserOut(**serialize(updated))
