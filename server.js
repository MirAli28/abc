require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai").default;

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is not set. Please create a .env file.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ──────────────────────────────────────────────
// POST /api/generate-plan
// ──────────────────────────────────────────────
app.post("/api/generate-plan", async (req, res) => {
  const { goal, hoursPerDay, currentSituation } = req.body;

  if (!goal || !hoursPerDay || !currentSituation) {
    return res.status(400).json({ error: "Missing required fields: goal, hoursPerDay, currentSituation" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a life coach and productivity expert. Generate exactly 3 clear, actionable daily tasks and a concise action plan.

Respond ONLY with valid JSON in this exact format:
{
  "tasks": [
    { "id": "task-1", "title": "Short task title", "description": "Clear, specific action the user should take", "timeEstimate": "X hours" },
    { "id": "task-2", "title": "Short task title", "description": "Clear, specific action the user should take", "timeEstimate": "X hours" },
    { "id": "task-3", "title": "Short task title", "description": "Clear, specific action the user should take", "timeEstimate": "X hours" }
  ],
  "actionPlan": "A concise 2-3 sentence strategy explaining the overall approach and what success looks like."
}`
        },
        {
          role: "user",
          content: `Goal: ${goal}
Available time per day: ${hoursPerDay} hours
Current situation: ${currentSituation}

Generate 3 daily tasks that fit within ${hoursPerDay} hours total.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return res.status(500).json({ error: "No response from AI" });

    res.json(JSON.parse(content));
  } catch (err) {
    console.error("Error calling OpenAI:", err.message);
    res.status(500).json({ error: "Failed to generate plan. Check your API key." });
  }
});

// ──────────────────────────────────────────────
// POST /api/chat
// ──────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message, context, history = [] } = req.body;

  if (!message || !context) {
    return res.status(400).json({ error: "Missing required fields: message, context" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful life coach assistant. The user is working on the following:
- Goal: ${context.goal}
- Hours available per day: ${context.hoursPerDay}
- Current situation: ${context.currentSituation}

Give concise, practical, and actionable answers. Keep responses under 150 words unless more detail is truly needed.`
        },
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message }
      ],
      max_tokens: 500
    });

    const reply = response.choices[0]?.message?.content || "I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    console.error("Error calling OpenAI:", err.message);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n✅ Vaajib is running at http://localhost:${PORT}\n`);
});
