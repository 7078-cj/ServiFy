# Service Marketplace

Full-stack marketplace app for discovering businesses, browsing services, booking appointments, and chatting with providers.

The project is split into:
- `frontend/`: React + Vite client
- `backend/`: Django REST + Channels API

## Core Features

- JWT auth (register, login, refresh) and protected frontend routes
- Forgot-password flow (request code, verify code, reset password, resend code)
- Profile management and saved user locations
- Business discovery and business profile pages
- Nested CRUD APIs for businesses, portfolios, services, and reviews
- Booking flows for both customers and business owners
- Real-time updates for chat, notifications, bookings, and reviews via WebSocket

## Tech Stack

### Frontend

- React 19
- Vite
- Redux Toolkit + React Redux
- React Router
- Mantine UI
- Tailwind CSS
- MapLibre GL
- FullCalendar

### Backend

- Django + Django REST Framework
- SimpleJWT
- Django Channels + Daphne
- Celery + django-celery-beat
- Redis (optional)
- SQLite (default local DB)

## Project Structure

```text
Service_Marketplace/
├─ backend/
│  ├─ api/
│  │  ├─ business/
│  │  ├─ chat/
│  │  └─ user/
│  ├─ backend/
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  ├─ asgi.py
│  │  └─ celery_app.py
│  ├─ websocket/
│  ├─ tasks/
│  ├─ executables/
│  ├─ manage.py
│  ├─ requirements.txt
│  ├─ Procfile
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ features/
│  │  ├─ hooks/
│  │  ├─ listeners/
│  │  ├─ pages/
│  │  └─ utils/
│  ├─ public/
│  ├─ package.json
│  ├─ vite.config.js
│  └─ .env.example
└─ README.md
```

## API Overview

Base API path: `/api/`

- User API mounted at `/api/user/`
  - token/login, token refresh, register
  - forgot-password flow
  - profile + profile update
  - locations
  - bookings (`my-bookings`, business bookings, booking cancel)
  - notifications
- Business API mounted at `/api/`
  - `all_businesses/`
  - `businesses/` + detail
  - nested `portfolios`, `reviews`, `services`
  - `categories/`
- Chat API mounted at `/api/chat/`
  - conversations list/create/delete
  - message list/create/detail
  - mark messages as read

## WebSocket Endpoints

ASGI routes include:

- `/ws/business_bookings/<user_id>/`
- `/ws/user_bookings/<user_id>/`
- `/ws/business_reviews/<business_id>/`
- `/ws/chat/<conversation_id>/`
- `/ws/conversation/<user_id>/`
- `/ws/notification/<user_id>/`

Frontend connects using `VITE_WS_URL` and appends `?token=<access_token>`.

## Environment Variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

- `SECRET_KEY`
- `CORS_ALLOWED_ORIGINS`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`
- Optional:
  - `REDIS_HOST`
  - `REDIS_PORT`
  - `ALLOWED_HOSTS`

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

- `VITE_API_URL` (e.g. `http://127.0.0.1:8000/api/`)
- `VITE_WS_URL` (e.g. `ws://127.0.0.1:8000`)

## Local Development

### 1) Backend

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Optional (if you run Redis/Celery worker locally):

```bash
celery -A backend worker --loglevel=info --pool=solo
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## NPM Scripts (Frontend)

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

## Runtime Notes

- If Redis is configured, Channels/Celery/cache use Redis.
- If Redis is not configured, app falls back to:
  - in-memory Channels layer
  - local-memory Django cache
  - eager Celery task execution
- `backend/executables/start_web.sh` runs migrations before `runserver`.
- `DEBUG` is currently `True` in backend settings (dev-oriented default).
