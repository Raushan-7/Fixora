# Fixora 2

A service booking web app built with **React** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Project Structure

```
Fixora/
├── src/                     ← React frontend
│   ├── components/          ← Navbar, Footer, BookingCard, etc.
│   ├── context/
│   │   └── AuthContext.jsx  ← Auth state using JWT tokens
│   ├── data/
│   │   └── services.js      ← Static list of services
│   ├── pages/               ← Home, Services, Booking, Dashboard, etc.
│   ├── styles/              ← CSS files per page
│   └── utils/
│       └── api.js           ← All API fetch calls (auth, bookings, contact)
│
├── backend/                 ← Node.js + Express + MongoDB API
│   ├── server.js            ← Entry point
│   ├── .env                 ← MONGO_URI, JWT_SECRET, PORT (never commit this)
│   ├── models/
│   │   ├── User.js          ← User schema (password hashed with bcrypt)
│   │   ├── Booking.js       ← Booking schema
│   │   └── Contact.js       ← Contact form schema
│   ├── middleware/
│   │   └── auth.js          ← JWT token verification middleware
│   └── routes/
│       ├── auth.js          ← POST /api/auth/signup  /login  GET /me
│       ├── bookings.js      ← GET/POST /api/bookings, PATCH /api/bookings/:id/cancel
│       └── contact.js       ← POST /api/contact
│
├── vite.config.js           ← Dev proxy: /api → http://localhost:5000
└── package.json             ← Frontend dependencies
```

---

## Setup & Run

### 1. Add your MongoDB URI

Edit `backend/.env`:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fixora2
JWT_SECRET=fixora2_super_secret_jwt_key_2024
PORT=5000
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Start both servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
node server.js

# Terminal 2 — Frontend (port 5173)
npm run dev
```

The Vite dev server proxies all `/api` requests to `localhost:5000` automatically.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get logged-in user |
| GET | `/api/bookings` | Yes | Get my bookings |
| POST | `/api/bookings` | Yes | Create a booking |
| PATCH | `/api/bookings/:id/cancel` | Yes | Cancel a booking |
| POST | `/api/contact` | No | Send contact message |
