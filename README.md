# Todo Mobile App

A full-stack Todo application với **Python FastAPI + MongoDB** backend và **React Native (Expo) + NativeWind** mobile frontend.

## Project Structure

```
todo_mobile_app/
├── backend/              # Python FastAPI + MongoDB
│   ├── app/
│   │   ├── main.py       # FastAPI entry + MongoDB lifespan
│   │   ├── database.py   # Motor async client
│   │   ├── models.py     # Document models
│   │   ├── schemas.py    # Pydantic schemas
│   │   ├── auth.py       # JWT authentication
│   │   ├── config.py     # Settings
│   │   └── routers/
│   │       ├── auth.py   # Auth endpoints
│   │       └── todos.py  # Todo CRUD endpoints
│   └── requirements.txt
│
└── mobile/               # React Native (Expo) + NativeWind (Tailwind)
    ├── src/
    │   ├── api/          # Axios HTTP services
    │   ├── store/        # Zustand auth state
    │   ├── hooks/        # React Query hooks
    │   ├── screens/      # App screens
    │   ├── components/   # Shared UI components
    │   └── navigation/   # React Navigation
    └── App.js
```

## Getting Started

### 1. Backend (FastAPI + MongoDB)
```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # cấu hình MONGODB_URL
uvicorn app.main:app --reload
```
> **Không cần migration** – indexes tự tạo khi server khởi động

### 2. Mobile (React Native + Expo)
```bash
cd mobile
npm install
npx expo start
```

## API Docs: http://localhost:8000/docs