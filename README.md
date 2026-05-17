# 🐝 BudgetBee — Daily Expense Tracker

A modern, full-stack MERN application for tracking daily income and expenses, managing budgets, and analyzing spending habits.

## ✨ Features

- **Authentication** — Register, Login, JWT-protected routes, Forgot/Reset Password
- **Dashboard** — Balance overview, monthly income/expense, savings, recent transactions
- **Transactions** — Add, edit, delete, search & filter by category/date/type/amount
- **Analytics** — Pie charts, bar charts, trend lines, category breakdowns
- **Budget Management** — Set monthly budgets, category limits, alert thresholds
- **Dark/Light Theme** — Full toggle support
- **Export** — Download transactions as CSV
- **Profile** — Avatar upload, multi-currency support, password change
- **Responsive** — Mobile-first, works on all devices

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Redux Toolkit, Tailwind CSS, Recharts, React Router v6 |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer |
| Storage | Multer (file uploads) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone & install dependencies**
   ```bash
   # Root dependencies (concurrently)
   npm install

   # Install all sub-packages
   npm run install:all
   ```

2. **Configure environment**
   ```bash
   # Copy and edit the server env file
   cp server/env.example server/.env
   # Edit server/.env with your MongoDB URI, JWT secret, email config
   ```

3. **Start development servers**
   ```bash
   npm run dev
   # OR separately:
   npm run server   # Backend on port 5000
   npm run client   # Frontend on port 5173
   ```

4. **Open in browser**
   - Frontend: http://localhost:5173
   - API: http://localhost:5000/api/health

## 📁 Project Structure

```
budgetbee/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/       # Recharts components
│   │   │   ├── common/       # Layout, Navbar, Sidebar
│   │   │   └── TransactionModal.jsx
│   │   ├── pages/            # All page components
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/       # Auth, Transaction, Budget, UI
│   │   ├── services/api.js   # Axios instance
│   │   └── utils/formatters.js
│   └── tailwind.config.js
│
└── server/                    # Node.js Backend
    ├── config/db.js
    ├── controllers/          # Auth, Transaction, Budget, User
    ├── middleware/            # Auth guard, upload, error handler
    ├── models/               # User, Transaction, Budget
    ├── routes/               # API routes
    └── server.js
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Send reset email |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/transactions` | Get transactions (with filters) |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary` | Dashboard summary |
| GET | `/api/transactions/export` | Export CSV |
| GET | `/api/budget` | Get budget |
| POST | `/api/budget` | Create/Update budget |
| GET | `/api/budget/history` | Budget history |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/password` | Change password |
| POST | `/api/users/avatar` | Upload avatar |

## 🌍 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/budgetbee
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

## 📸 Pages

- **/** — Landing page
- **/login** — Sign in
- **/register** — Create account
- **/dashboard** — Financial overview
- **/transactions** — Transaction management
- **/analytics** — Charts & reports
- **/budget** — Budget management
- **/profile** — User settings
- **/settings** — App preferences

---

Built with ❤️ using the MERN Stack
