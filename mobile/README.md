# Todo App – React Native Mobile

A beautiful Todo mobile app built with **React Native (Expo)**, **NativeWind (Tailwind CSS)**, **React Query**, and **Zustand**.

## Quick Start

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** app on your phone, or press:
- `a` – open Android emulator
- `i` – open iOS simulator

## Tech Stack

| Library | Purpose |
|---------|---------|
| Expo | React Native toolchain |
| NativeWind v4 | Tailwind CSS for React Native |
| React Navigation | Navigation (Stack + Bottom Tabs) |
| @tanstack/react-query | Server state / data fetching |
| Zustand | Auth global state |
| Axios | HTTP client |
| expo-secure-store | JWT token secure storage |
| date-fns | Date formatting |

## Project Structure

```
mobile/
├── App.js                   # Entry: providers + nav guard
├── global.css               # NativeWind base styles
├── tailwind.config.js       # Custom dark theme tokens
├── babel.config.js          # NativeWind babel preset
├── src/
│   ├── api/
│   │   ├── client.js        # Axios + JWT interceptors
│   │   ├── authApi.js       # Auth service
│   │   └── todosApi.js      # Todos CRUD service
│   ├── store/
│   │   └── authStore.js     # Zustand auth store
│   ├── hooks/
│   │   └── useTodos.js      # React Query hooks
│   ├── constants/
│   │   └── index.js         # Priority/category config
│   ├── navigation/
│   │   ├── AuthNavigator.jsx
│   │   └── AppNavigator.jsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.jsx
│   │   │   └── RegisterScreen.jsx
│   │   └── main/
│   │       ├── HomeScreen.jsx
│   │       ├── CreateTodoScreen.jsx
│   │       ├── TodoDetailScreen.jsx
│   │       └── ProfileScreen.jsx
│   └── components/
│       ├── TodoCard.jsx     # Reusable todo card
│       └── FilterBar.jsx    # Filter chips
```

## API Configuration

Edit `mobile/.env`:
```
API_BASE_URL=http://10.0.2.2:8000   # Android emulator
# API_BASE_URL=http://localhost:8000  # iOS simulator
# API_BASE_URL=http://YOUR_IP:8000    # Physical device
```

## Features

- 🔐 JWT Authentication (register, login, auto-restore session)
- ✅ Full Todo CRUD (create, read, update, delete, toggle)
- 🔍 Search + multi-filter (status, priority, category)
- 📊 Statistics dashboard on profile
- 🎨 Dark theme with NativeWind Tailwind
- 🔄 Pull-to-refresh with React Query
