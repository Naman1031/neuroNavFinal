import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MURF_API_URL = "https://api.murf.ai/v1/speech/generate";

// Voice mapping for speakers
const voiceMap = {
  Alex: "en-US-natalie",  // Female
  Jamie: "en-US-ken",  // Male
};

const generatePodcastDialog = async (req, res) => {
  const { prompt, pdfData } = req.body;

  if (!prompt && !pdfData) {
    return res.status(400).json({ error: "Either prompt or PDF data is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the input text
    const inputText = `
Create a natural-sounding podcast conversation between exactly two people: Alex and Jamie.

${prompt ? `Topic: ${prompt}` : ""}

${pdfData ? `Use this background content as reference:\n${pdfData}` : ""}

Make the conversation friendly, informative, and informal. Alternate turns. Keep it to 6–10 exchanges total (3–5 for each speaker). 
It should teach and cover everything in the text.

Only output plain dialog in the format:
Alex: [text]
Jamie: [text]

No extra narration, no headers, no markdown, no bullet points.
    `;

    const result = await model.generateContent(inputText);
    const response = result.response;
    const text = response.text();

    // Parse dialog lines
    const lines = text.split("\n").filter(Boolean);
    const dialog = lines
      .map((line) => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          return {
            speaker: match[1].trim(),
            text: match[2].trim(),
          };
        }
        return null;
      })
      .filter(Boolean);

    const audioResults = [];

    for (const { speaker, text } of dialog) {
      try {
        const voiceId = voiceMap[speaker] || voiceMap["Alex"];

        const ttsRes = await axios.post(
          MURF_API_URL,
          {
            text,
            voiceId,
          },
          {
            headers: {
              "api-key": process.env.murf_api_key,
              "Content-Type": "application/json",
            },
          }
        );

        const { audioFile } = ttsRes.data;

        audioResults.push({
          speaker,
          text,
          audioFile,
        });
      } catch (ttsErr) {
        console.error("Murf TTS error:", ttsErr.response?.data || ttsErr.message);
        audioResults.push({
          speaker,
          text,
          audioFile: null,
          error: "TTS failed",
        });
      }
    }

    res.json({ podcast: audioResults });
  } catch (error) {
    console.error("Gemini or TTS error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate podcast dialog." });
  }
};

export default generatePodcastDialog;