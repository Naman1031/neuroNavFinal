import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

import { generateVoiceClip } from "../services/murfService.js";
import { mergeAudioFiles } from "../services/mergeAudio.js";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePodcastScript = async (req, res) => {
  const { prompt, pdfData } = req.body;

  if (!prompt && !pdfData) {
    return res
      .status(400)
      .json({ error: "Prompt or PDF Content are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `You're writing a podcast script for two friendly hosts named Alex and Sam.Do NOT wrap the response in triple backticks or markdown formatting.

Topic: ${prompt}

PDF Content:
${pdfData}



Respond with only an array of objects like this:
[
  { "speaker": "Alex", "text": "Hey everyone, welcome to the podcast!" },
  { "speaker": "Sam", "text": "Today we’re talking about..." }
]
  just give 2 lines per speaker`
    );

    const scriptResponse = result.response.text();
    const parsedScript = JSON.parse(scriptResponse);
    console.log(parsedScript);
    // Ensure output folder exists
    const outputDir = "output";
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    
    // Generate audio clips
    const audioPaths = [];
    for (let i = 0; i < parsedScript.length; i++) {
      const { speaker, text } = parsedScript[i];
      const audioPath = await generateVoiceClip(speaker, text, i);
      audioPaths.push(audioPath);
    }
    // Merge clips
    const finalAudioPath = `output/final_podcast_${Date.now()}.mp3`;
    await mergeAudioFiles(audioPaths, finalAudioPath);

    res.status(200).json({
      message: "Podcast generated successfully",
      audioPath: finalAudioPath,
      script: parsedScript
    });
  } catch (error) {
    console.error("Podcast generation error:", error);
    res.status(500).json({ error: "Failed to generate podcast" });
  }
};

export default generatePodcastScript;
