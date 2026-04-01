# Semippu — Retirement Planning for Daily Wage Workers

Semippu is an AI-powered retirement savings platform built for India's 300M+ daily wage and informal sector workers. It provides personalized savings suggestions, government scheme recommendations, and retirement corpus projections — all based on irregular income patterns.

---

## Features

- Phone number authentication with OTP
- Personalized AI savings plan based on income range
- Government scheme eligibility checker (APY, PPF, NPS, Post Office RD)
- Daily and monthly savings suggestions
- Retirement corpus calculator using compound interest
- Monthly pension estimator
- Contribution tracking and history
- Loan management system
- Admin dashboard
- Multi-language support
- Dark/light theme

---

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Express.js (backend server)
- SQLite (database)
- Firebase (authentication)
- Framer Motion (animations)

---

## Project Structure
```
semippu/
├── src/
│   ├── pages/
│   │   ├── AI.tsx          ← AI insights page
│   │   ├── Dashboard.tsx   ← Main dashboard
│   │   ├── Auth.tsx        ← Login/Register
│   │   ├── Invest.tsx      ← Contribution tracking
│   │   ├── Loans.tsx       ← Loan management
│   │   ├── Policies.tsx    ← Government schemes
│   │   ├── Settings.tsx    ← User settings
│   │   └── Admin.tsx       ← Admin panel
│   ├── context/
│   │   ├── PensionContext.tsx   ← Global state + AI integration
│   │   ├── LanguageContext.tsx  ← i18n support
│   │   └── ThemeContext.tsx     ← Dark/light theme
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Layout.tsx
│   └── i18n/
│       └── translations.ts
├── server.ts       ← Express backend + API proxy
├── index.html
└── vite.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+ (for AI backend)

### Installation
```bash
git clone https://github.com/aishverse1/semippu-frontend.git
cd semippu-frontend
npm install
```

### Environment Variables

Create a `.env` file:
```
JWT_SECRET=your_secret_key
FASTAPI_URL=http://127.0.0.1:8000
```

### Run Locally
```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## AI Integration

This frontend connects to the Semippu AI backend via Express proxy:
```
Frontend → Express (/api/ai/predict) → FastAPI → AI Model
```

Make sure the AI backend is running before using the AI page.

---

## Deployment

Frontend is deployed on **Vercel**.
AI backend is deployed on **Hugging Face Spaces**.

---

## Team

Built for Zenith Hackathon 2025
