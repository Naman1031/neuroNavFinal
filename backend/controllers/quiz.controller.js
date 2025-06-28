import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const quiz = async (req, res) => {
  const { prompt, pdfData } = req.body;

  if (!prompt && !pdfData) {
    return res
      .status(400)
      .json({ error: "Either prompt or PDF data is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const inputText = `
Create a quiz of 10 multiple-choice questions based on the information provided below.

${prompt ? `Topic: ${prompt}` : ""}

${pdfData ? `Use this background content as reference:\n${pdfData}` : ""}

Each question should include:
- A clear and relevant question based on the text.
- Four answer options in an array.
- The correct answer (must match one of the options).

Return the output as a **JSON array of 10 objects**, each in the following format:

[
  {
    "question": "Your question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct Option"
  },
  ...
]

Ensure that:
- The answer exactly matches one of the options.
- All content is based on the text provided.
- The quiz is useful for someone reviewing or studying the material.

Only output valid JSON. Do not include explanations or any extra text.
`;

    const result = await model.generateContent(inputText);
    const text = await result.response.text();

    // Safely parse JSON output
    let quizJson;
    try {
      quizJson = JSON.parse(text);
    } catch (e) {
      // Try to fix common issues (like code block formatting)
      const cleanedText = text
        .trim()
        .replace(/^```json|```$/g, "")
        .trim();
      quizJson = JSON.parse(cleanedText);
    }

    res.status(200).json(quizJson);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
};