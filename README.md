# Modern Website - React + FastAPI

A premium, full-stack website with authentication and a dashboard.

## Setup Instructions

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
The backend will run on `http://localhost:8001`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Features
- **Landing Page**: High-impact modern hero section with features.
- **Authentication**: JWT-based login and signup flow.
- **Dashboard**: Protected route with user stats and project management.
- **Aesthetics**: Glassmorphism, premium typography (Inter/Outfit), and smooth animations.
