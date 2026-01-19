# CareerPilot AI 🚀

CareerPilot AI is a production-quality, full-stack generative AI agent application designed to help final-year university students improve their placement readiness.

## 🎯 Project Overview
Preparing for campus placements can be overwhelming. CareerPilot AI simplifies this by providing an intelligent AI agent that analyzes a student's resume against their target job role, identifies skill gaps, and generates a personalized preparation roadmap.

## 🧩 Core User Flow
1. **Role Selection**: User chooses a target job role.
2. **Resume Input**: User pastes their resume content.
3. **AI Analysis**: The agent validates input and performs a deep analysis.
4. **Structured Roadmap**: User receives:
   - Resume Quality & Relevance Scores
   - Identified Skill Gaps with recommendations
   - A Personalized 7-Day Prep Plan
   - Target-specific Mock Interview Questions

## 🤖 AI Agent Design
The system uses **Pydantic AI** for robust agent orchestration.
- **Strict Validation**: Uses Pydantic models to ensure structured JSON output.
- **Intelligent Feedback**: Asks clarifying questions if the input is insufficient.
- **Provider**: **OpenRouter** (connecting to models like Gemini 2.0 Flash or LLaMA 3).
- **Tooling**: Custom tools for input validation and profile scoring.

## 🧱 Architecture
- **Frontend**: React (TypeScript), Vite, Framer Motion for animations, Lucide React for icons.
- **Backend**: FastAPI, Pydantic AI, Loguru for logging.
- **Communication**: RESTful API via Axios.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenRouter API Key

### Backend Setup
1. Navigate to `/backend`
2. Create a `.env` file with:
   ```env
   OPENROUTER_API_KEY=your_key_here
   MODEL_ID=google/gemini-2.0-flash-exp:free
   ```
3. Install dependencies: `pip install -r requirements.txt`
4. Run the server: `python main.py` or `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## 🏁 Deployment
- **Frontend**: Deployed to Vercel/Netlify.
- **Backend**: Deployed to Railway/Render.
- **Environment**: Production variables must be set for OpenRouter API keys.

---
*Built for Final Year Placement Assessment*
