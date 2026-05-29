from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client: AsyncIOMotorClient = None


def get_database():
    return client[settings.DATABASE_NAME]

# ── Collection helpers ────────────────────────────────────────────────────────

def get_users_col():
    return get_database()["users"]

def get_tasks_col():
    return get_database()["tasks"]

def get_categories_col():
    return get_database()["categories"]

def get_task_templates_col():
    return get_database()["task_templates"]

# ── Lifecycle ─────────────────────────────────────────────────────────────────

async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await client.admin.command("ping")
    print(f"[OK] Connected to MongoDB - DB: {settings.DATABASE_NAME}")


async def close_db():
    global client
    if client:
        client.close()
        print("[INFO] MongoDB connection closed")


async def create_indexes():
    """Tạo indexes. Bỏ qua nếu đã tồn tại."""
    users = get_users_col()
    tasks = get_tasks_col()
    await users.create_index("email", unique=True)
    await tasks.create_index("userId")
    await tasks.create_index([("taskDate", -1)])
    print("[OK] MongoDB indexes ready")
