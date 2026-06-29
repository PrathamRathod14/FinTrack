# FinTrack — Full Stack Expense Tracker

A professional, full-stack expense tracking web application built with React, Node.js, Express, and MongoDB. Every piece of data is stored in and retrieved from a real MongoDB database via a REST API — zero static data, zero mock data.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)

Live: https://prathamrathod14.github.io/FinTrack/

---

## Features

- **Dashboard** — Summary cards, income vs expenses chart, budget overview, recent transactions
- **Transactions** — Full CRUD with filters, search, pagination, and CSV export
- **Analytics** — Bar, donut, and area charts with category breakdown
- **Budget** — Budget tracking with progress bars and over-budget alerts
- **Settings** — Currency switcher (EUR/USD/GBP/INR/JPY), data export, danger zone
- **Responsive** — Works on desktop, tablet, and mobile
- **Real Data** — All data from MongoDB via REST API, zero hardcoded values

---

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **MongoDB Atlas** account (free tier) — [Sign up](https://www.mongodb.com/cloud/atlas/register)

---

## Project Structure

```
fintrack/
├── client/                  → React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/      → Reusable UI + form components
│   │   ├── pages/           → Dashboard, Transactions, Analytics, Budget, Settings
│   │   ├── context/         → CurrencyContext (global currency from DB)
│   │   ├── services/        → All Axios API call functions
│   │   └── utils/           → Constants, helper functions
│   └── package.json
├── server/                  → Node.js + Express backend
│   ├── models/              → Mongoose models (Transaction, Budget, Settings)
│   ├── routes/              → Express route files
│   ├── controllers/         → Route handler logic (with MongoDB aggregation pipelines)
│   ├── middleware/           → Error handler, validators (express-validator)
│   └── server.js
├── shared/                  → Shared constants (categories, payment methods, currencies)
├── .gitignore
└── README.md
```

---

## Getting a Free MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account
2. Click **"Build a Database"** → Choose **"M0 Free"** tier
3. Pick a cloud provider and region (any works)
4. Set a **database user** (username + password) — remember these!
5. Under **Network Access**, click **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Go to **"Database"** → Click **"Connect"** → **"Connect your application"**
7. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/fintrack?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password and ensure the database name is `fintrack`

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/fintrack.git
cd fintrack
```

### 2. Setup the server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/fintrack?retryWrites=true&w=majority
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

### 3. Setup the client

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the client:

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## API Endpoints

### Transactions — `/api/transactions`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all (supports `?type=`, `?category=`, `?month=`, `?year=`, `?search=`, `?page=`, `?limit=`) |
| GET | `/api/transactions/:id` | Get single |
| POST | `/api/transactions` | Create |
| PUT | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Delete one |
| DELETE | `/api/transactions?confirm=true` | Delete all |

### Budgets — `/api/budgets`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get all (supports `?month=`, `?year=`) |
| GET | `/api/budgets/:id` | Get single |
| POST | `/api/budgets` | Create |
| PUT | `/api/budgets/:id` | Update |
| DELETE | `/api/budgets/:id` | Delete |

### Analytics — `/api/analytics`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary?month=&year=` | Monthly summary |
| GET | `/api/analytics/by-category?month=&year=` | Expenses by category |
| GET | `/api/analytics/monthly-trend?year=` | 12-month income/expenses trend |
| GET | `/api/analytics/daily-trend?month=&year=` | Daily spending |
| GET | `/api/analytics/budget-status?month=&year=` | Budget vs actual |

### Settings — `/api/settings`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get settings |
| PUT | `/api/settings` | Update currency |

---

## Deployment

### Backend — Deploy to Render.com (Free)

1. Push your code to GitHub
2. Go to [Render.com](https://render.com/) and sign up (free)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `fintrack-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add **Environment Variables**:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `PORT` = `5000`
   - `CLIENT_URL` = `https://<your-username>.github.io` (your GitHub Pages URL)
7. Click **"Create Web Service"**
8. Note your Render URL (e.g., `https://fintrack-api.onrender.com`)

### Frontend — Deploy to GitHub Pages

1. In `client/package.json`, update the `homepage` field:
   ```json
   "homepage": "https://<your-username>.github.io/fintrack"
   ```

2. In `client/vite.config.js`, set the `base` path:
   ```js
   base: '/fintrack/'
   ```

3. Create `client/.env.production`:
   ```env
   VITE_API_URL=https://fintrack-api.onrender.com/api
   ```

4. Build and deploy:
   ```bash
   cd client
   npm run build
   npm run deploy
   ```

5. Go to your GitHub repo → **Settings** → **Pages** → Source should be `gh-pages` branch

---

## Environment Variables

### Server (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client (`client/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

<img width="1511" height="736" alt="WhatsApp Image 2026-06-29 at 1 46 06 PM" src="https://github.com/user-attachments/assets/2b0fb1c9-e975-411c-8838-faafebc0cad9" />

<img width="1414" height="729" alt="WhatsApp Image 2026-06-29 at 1 46 47 PM" src="https://github.com/user-attachments/assets/a54b18d2-6242-40fa-82a5-6bfc0c366cc1" />


## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| State Management | TanStack React Query |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Validation | express-validator |

---

## License

MIT
