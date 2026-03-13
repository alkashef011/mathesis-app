import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, system } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages,
    });

    const text = response.content.map((block) => block.text || "").join("");

    res.json({ text });
  } catch (error) {
    console.error("Claude API error:", error.message);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
