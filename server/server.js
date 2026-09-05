const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Minor Project Backend is running!"
  });
});

const studyAssistantInstruction =
  "You are a personalized student study assistant. Explain academic concepts clearly with beginner-friendly language. Give step-by-step explanations when useful, include examples, and help with programming, computer science, mathematics, and other academic subjects. Generate practice questions when asked. Help students understand concepts rather than simply giving unexplained answers. Keep answers reasonably concise unless the student asks for detail.";

// AI Assistant API
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured.");
    return res.status(500).json({ error: "AI service is not configured. Please try again later." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: question.trim(),
      config: { systemInstruction: studyAssistantInstruction }
    });
    const answer = response.text?.trim();

    if (!answer) {
      console.error("Gemini returned an empty response.");
      return res.status(502).json({ error: "The AI service returned no answer. Please try again." });
    }

    res.json({ answer });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const safeErrorMessage = errorMessage.replaceAll(process.env.GEMINI_API_KEY, "[REDACTED]");
    console.error("Gemini API error:", {
      name: error?.name,
      status: error?.status,
      message: safeErrorMessage,
      stack: error instanceof Error ? error.stack?.replaceAll(process.env.GEMINI_API_KEY, "[REDACTED]") : undefined
    });
    res.status(500).json({ error: "Unable to get an AI response right now. Please try again later." });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
