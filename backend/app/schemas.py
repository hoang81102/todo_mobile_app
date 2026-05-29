from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# ─── User ────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    fullName: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    avatar_url: Optional[str] = None


class UserOut(BaseModel):
    id: str
    fullName: str
    email: str
    createdAt: datetime
    avatar_url: Optional[str] = None


# ─── Auth ─────────────────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


# ─── Category ─────────────────────────────────────────────────────────────────

class CategoryCreate(BaseModel):
    name: str
    icon: str
    color: str


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None


class CategoryOut(BaseModel):
    id: str
    name: str
    icon: str
    color: str


# ─── Task Template ────────────────────────────────────────────────────────────

class TaskTemplateCreate(BaseModel):
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    defaultStartTime: Optional[str] = None   # "07:00"


class TaskTemplateUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    defaultStartTime: Optional[str] = None


class TaskTemplateOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    defaultStartTime: Optional[str] = None


# ─── Task ─────────────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"              # pending | completed | cancelled
    priority: str = "medium"            # low | medium | high
    taskDate: Optional[str] = None      # "2026-05-30"
    startTime: Optional[str] = None     # "07:00"
    endTime: Optional[str] = None       # "07:30"
    isReminderEnabled: bool = False
    categoryId: Optional[str] = None    # ObjectId of category


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    taskDate: Optional[str] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    isReminderEnabled: Optional[bool] = None
    categoryId: Optional[str] = None


class TaskOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    taskDate: Optional[str] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    isReminderEnabled: bool = False
    categoryId: Optional[str] = None
    userId: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


class TaskListResponse(BaseModel):
    tasks: List[TaskOut]
    total: int
    page: int
    page_size: int
