# SpendWise — MERN Expense Tracker

A professional expense tracker with glassmorphism UI, particle effects, animated charts, and full CRUD.

## Stack
- **Backend**: Node.js, Express, MongoDB, JWT auth
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, Chart.js, Zustand

## Quick Start

### 1. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment
Edit `server/.env` with your MongoDB URI.

### 3. Run
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open http://localhost:5173

## Features
- JWT authentication (register/login)
- Add/edit/delete income & expenses
- Category tagging with emoji icons
- Summary cards (balance, income, expenses)
- Filter & search transactions
- Bar, Line, and Doughnut charts
- Glassmorphism dark UI with particle background
- Framer Motion animations throughout
- Fully responsive
