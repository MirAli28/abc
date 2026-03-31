# Vaajib – Do what actually matters

AI-powered daily clarity app that gives you 3 actionable tasks and a personal coach.

## How to Run

### 1. Install Node.js
Download from https://nodejs.org (version 18 or higher)

### 2. Get an OpenAI API Key
Sign up at https://platform.openai.com and create an API key.

### 3. Set Up the Project

```bash
# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open the `.env` file and paste your OpenAI API key:
```
OPENAI_API_KEY=sk-...your-key-here...
PORT=3000
```

### 4. Start the App

```bash
npm start
```

Open your browser and go to: **http://localhost:3000**

---

## Files

| File         | Purpose                                      |
|--------------|----------------------------------------------|
| `index.html` | Complete frontend (HTML + CSS + JavaScript)  |
| `server.js`  | Express backend with OpenAI AI routes        |
| `package.json` | Project dependencies                       |
| `.env`       | Your secret API key (never share this file)  |

## API Endpoints

| Method | Path                  | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/api/generate-plan`  | Generate 3 tasks + plan   |
| POST   | `/api/chat`           | Chat with the AI coach    |

---

Built with Express + vanilla HTML/CSS/JS + OpenAI GPT-4o
