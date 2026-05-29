from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_db, close_db, create_indexes
from app.routers import auth, tasks, categories, task_templates


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    await create_indexes()
    yield
    await close_db()


app = FastAPI(
    title="Todo App API",
    description="FastAPI + MongoDB (todo_app) — collections: users, tasks, categories, task_templates",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(categories.router)
app.include_router(task_templates.router)


@app.get("/")
def root():
    return {
        "message": "Todo App API 🚀",
        "database": "todo_app (MongoDB)",
        "collections": ["users", "tasks", "categories", "task_templates"],
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
