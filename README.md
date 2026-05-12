# 🤖 AI Reddit Moderator Assistant

<div align="center">

![AI Reddit Moderator](https://img.shields.io/badge/AI-Reddit%20Moderator-FF4500?style=for-the-badge&logo=reddit&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Professional AI-powered Reddit moderation tool for the Reddit Mod Tools and Migrated Apps Hackathon**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Screenshots](#screenshots) • [Deployment](#deployment) • [API](#api-endpoints)

</div>

---

## 📋 Overview

AI Reddit Moderator is a modern, production-ready web application that helps Reddit moderators automate content moderation using artificial intelligence. The system monitors subreddits in real-time, detects toxic content, spam, hate speech, and NSFW material, then provides smart moderation recommendations.

### 🏆 Why This Wins

- **Real AI Integration** - Uses OpenAI GPT or Google Gemini for intelligent content analysis
- **Built on Devvit** - Runs natively on Reddit as an installable mod tool
- **Production Architecture** - Clean FastAPI backend with React frontend
- **Beautiful UI/UX** - Glassmorphism dark theme with professional dashboard, charts, and animations
- **Ported from PRAW** - Successfully migrated from PRAW bot to Devvit platform app

---

## ✨ Features

### 🔍 AI-Powered Content Analysis
- **Toxicity Detection** - Identifies toxic, offensive, and harassing content
- **Spam & Scam Detection** - Recognizes promotional content, scams, and phishing
- **Hate Speech Filtering** - Detects hate speech with contextual understanding
- **NSFW Content Detection** - Flags adult and explicit content

### 🎯 Smart Moderation Actions
- **APPROVE** - Content is safe and can be published
- **REMOVE** - Content violates rules and should be removed
- **WARN** - Content is borderline, issue a warning
- **ESCALATE** - Content needs human moderator review

### 📊 Professional Dashboard
- **Live Moderation Feed** - Real-time post monitoring with animated updates
- **Analytics Charts** - Activity trends, risk distribution, action breakdowns
- **Moderation Queue** - Filterable queue with search and risk level filtering
- **History Logs** - Complete moderation history with detailed records

### ⚙️ Advanced Configuration
- **API Key Management** - Configure OpenAI, Gemini, and Reddit API keys
- **Subreddit Management** - Add/remove monitored subreddits
- **AI Sensitivity** - Adjustable moderation strictness
- **Theme Settings** - Dark/Light mode toggle

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Tailwind CSS 3 | Styling with custom design system |
| Framer Motion | Animations and transitions |
| Recharts | Interactive charts and graphs |
| React Router v6 | Client-side routing |
| React Hot Toast | Notification system |
| Axios | HTTP client |
| Vite | Build tool and dev server |

### Devvit App (Hackathon Submission)
| Technology | Purpose |
|-----------|---------|
| Devvit | Reddit's developer platform - runs natively on Reddit |
| TypeScript | App logic with menu actions, triggers, and forms |
| HTTP Fetch | Calls the backend AI analysis API |
| Redis | Stores analysis results per post |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | REST API framework (AI analysis service) |
| OpenAI GPT / Gemini | AI content analysis |
| SQLAlchemy | ORM for database |
| SQLite | Database (easy local setup) |
| Pydantic | Data validation |
| Python-jose | Token authentication |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Devvit CLI (`npm install -g @devvit/cli`)
- Reddit developer account ([developers.reddit.com](https://developers.reddit.com))
- OpenAI API key or Google Gemini API key

### 1️⃣ Clone & Setup

```bash
git clone https://github.com/yourusername/ai-reddit-moderator.git
cd ai-reddit-moderator
```

### 2️⃣ Backend Setup

```bash
# Create virtual environment
cd backend
python -m venv venv

# Activate (Windows - PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Copy root .env.example into backend/ and rename to .env
copy ..\.env.example .env
# Then edit .env with your API keys

# Run the server (MUST run from project root, not from backend/)
cd ..
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### 3️⃣ Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### 3️⃣ Devvit App Setup

```bash
cd devvit-app

# Install dependencies
npm install

# Login to Devvit CLI
devvit login

# Playtest in a test subreddit (creates one if none specified)
npm run dev

# Or upload to your subreddit
devvit upload
```

The Devvit app adds these moderation tools to Reddit:
- **"Analyze with AI Mod"** menu item on posts - analyzes content and posts a comment with results
- **"Quick Check"** menu item on comments - analyzes and flags if needed
- **"Batch Scan Hot Posts"** subreddit menu item - scans top 10 hot posts
- **Auto-moderation** trigger on new post submission (configurable via settings)

> **Note**: The Devvit app calls the deployed backend for AI analysis. Update the backend URL in Devvit settings after deployment.

### 4️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
# Reddit API Credentials
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=AI-Mod-Assistant/v1.0

# AI Provider (openai or gemini)
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# Database
DATABASE_URL=sqlite:///./moderator.db

# App Settings
SECRET_KEY=your-secret-key-change-in-production
DEBUG=true
```

---

## ☁️ Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ai-reddit-moderator-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/api/health`
5. Add environment variables from `.env.example`
6. Deploy!

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable: `VITE_API_URL=https://your-render-app.onrender.com`
5. Deploy!

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Moderation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/moderation/analyze` | Analyze a single post |
| POST | `/api/moderation/analyze-batch` | Analyze multiple posts |
| GET | `/api/moderation/subreddit/{name}` | Moderate subreddit hot posts |
| GET | `/api/moderation/history` | Get moderation history |
| GET | `/api/moderation/dashboard/{subreddit}` | Get dashboard data |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact/send` | Send contact message |
| GET | `/api/settings/` | Get settings |
| PUT | `/api/settings/` | Update settings |
| GET | `/api/health` | Health check |
| GET | `/api/stats/overview` | Platform overview stats |

---

## 📁 Project Structure

```
ai-reddit-moderator/
├── devvit-app/                  # Devvit app (HACKATHON SUBMISSION)
│   ├── src/
│   │   └── server/
│   │       ├── index.ts        # Menu actions, triggers, settings
│   │       └── ai-client.ts    # AI analysis (calls backend + fallback)
│   ├── assets/
│   │   └── icon.svg            # App icon
│   ├── devvit.json             # Devvit app configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── frontend/                    # React dashboard (optional)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ModerationCard.jsx
│   │   │   ├── AnimatedCounter.jsx
│   │   │   ├── SectionTitle.jsx
│   │   │   └── LivePreview.jsx
│   │   ├── context/            # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Settings.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                     # FastAPI backend (AI analysis service)
│   ├── routes/
│   │   ├── auth.py
│   │   ├── moderation.py
│   │   ├── contact.py
│   │   └── settings.py
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── moderation_service.py
│   │   └── reddit_service.py
│   ├── database/
│   │   └── schema.sql
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── main.py
│   ├── seed_data.py
│   ├── requirements.txt
│   └── runtime.txt
├── database/
│   └── (auto-generated SQLite DB)
├── .env.example
├── .gitignore
└── README.md
```

---

## 🎨 Design Highlights

### UI/UX Features
- **Glassmorphism** - Frosted glass cards and panels with backdrop blur
- **Dark Futuristic Theme** - Professional dark theme with AI-inspired gradients
- **Smooth Animations** - Framer Motion page transitions, counter animations, live feed
- **Responsive Design** - Fully responsive from mobile to ultrawide desktop
- **Interactive Charts** - Recharts-powered analytics with custom tooltips
- **Reddit-Inspired Colors** - Orange accents with blue/purple AI gradients

### Dashboard Features
- **Live Moderation Feed** - Animated feed showing real-time moderation decisions
- **Risk Distribution Pie Chart** - Visual breakdown of content risk levels
- **24-Hour Activity Chart** - Area chart showing moderation activity trends
- **Moderation Queue** - Filterable, searchable queue with status badges
- **History Table** - Sortable and filterable moderation history

### Devvit App Integration
- **Native Reddit Integration** - Runs directly inside Reddit's UI
- **Menu Actions** - "Analyze with AI Mod" on posts, "Quick Check" on comments
- **Batch Scanning** - Scan hot posts from the subreddit menu
- **Auto-Moderation** - Trigger-based analysis on new post submissions
- **Configurable Settings** - Sensitivity, auto-remove, auto-report per subreddit
- **Fallback Analysis** - Built-in rule-based engine when backend is unreachable

---

## 🤝 Contributing

This project was created for the **Reddit Mod Tools and Migrated Apps Hackathon**. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  Made with ❤️ for the Reddit Mod Tools Hackathon
</div>
