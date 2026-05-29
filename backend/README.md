# Todo App – Python Backend (FastAPI + MongoDB)

Kết nối trực tiếp với database **`todo_app`** đang chạy tại `localhost:27017`.

## Quick Start

```bash
# 1. Tạo và kích hoạt virtual environment
python -m venv venv
venv\Scripts\activate

# 2. Cài dependencies
pip install -r requirements.txt

# 3. (Đã có .env) Kiểm tra cấu hình
# MONGODB_URL=mongodb://localhost:27017
# DATABASE_NAME=todo_app

# 4. Chạy server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### 🔐 Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Đăng ký (`fullName`, `email`, `password`) |
| POST | /api/auth/login | Đăng nhập (`email`, `password`) → JWT |
| GET | /api/auth/me | Thông tin user hiện tại |
| PUT | /api/auth/me | Cập nhật profile |

### ✅ Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/tasks | Danh sách (filter: status, priority, taskDate, categoryId) |
| POST | /api/tasks | Tạo task mới |
| GET | /api/tasks/{id} | Chi tiết task |
| PUT | /api/tasks/{id} | Cập nhật task |
| PATCH | /api/tasks/{id}/status?new_status=completed | Đổi trạng thái |
| DELETE | /api/tasks/{id} | Xóa task |

### 🗂️ Categories
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/categories | Tất cả categories |
| POST | /api/categories | Tạo mới (`name`, `icon`, `color`) |
| PUT | /api/categories/{id} | Cập nhật |
| DELETE | /api/categories/{id} | Xóa |

### 📋 Task Templates
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/task-templates | Tất cả templates |
| POST | /api/task-templates | Tạo mới |
| PUT | /api/task-templates/{id} | Cập nhật |
| DELETE | /api/task-templates/{id} | Xóa |

## MongoDB Collections (todo_app)

### users
```json
{ "fullName": "Hoang Vu", "email": "hoang@gmail.com", "passwordHash": "...", "createdAt": "..." }
```

### tasks
```json
{ "title": "Ăn sáng", "description": "...", "status": "pending", "priority": "high",
  "taskDate": "2026-05-30", "startTime": "07:00", "endTime": "07:30",
  "isReminderEnabled": true, "userId": "...", "categoryId": "..." }
```

### categories
```json
{ "name": "Ăn uống", "icon": "🍽️", "color": "#FF9800" }
```

### task_templates
```json
{ "title": "Ăn sáng", "description": "Ăn sáng đầy đủ", "icon": "🍳", "defaultStartTime": "07:00" }
```

## Lưu ý về password
- User cũ (`123456` plaintext): server tự động nhận diện và so sánh trực tiếp ✅
- User mới: password sẽ được hash bằng **bcrypt** ✅
