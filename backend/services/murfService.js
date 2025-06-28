import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const MURF_API_URL = "https://api.murf.ai/v1/speech/generate";

// Speaker-to-voice mapping — customize based on available Murf voices
const voiceMap = {
  Alex: "en-US-natalie", // Female
  Sam: "en-US-terrell",  // Male
};

/**
 * Generate a voice clip using Murf API
 * @param {string} speaker - Speaker name (e.g. "Alex")
 * @param {string} text - Text to convert to speech
 * @param {number} index - Index to help name the file
 * @returns {string} - Local path to saved audio file
 */
export const generateVoiceClip = async (speaker, text, index) => {
  const voiceId = voiceMap[speaker];
  console.log(voiceId, speaker);
  if (!voiceId) throw new Error(`Voice not found for speaker: ${speaker}`);

  try {
    // Step 1: Request TTS audio from Murf
    const data = { text, voiceId };
    const response = await axios.post(MURF_API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.MURF_API_KEY,
      },
    });

    const audioUrl = response.data.audioFile;
    if (!audioUrl) throw new Error("No audio file URL returned from Murf.");

    // Step 2: Download the audio file
    const audioBuffer = await axios.get(audioUrl, { responseType: "arraybuffer" });

    // Step 3: Save the audio file locally
    const fileName = `audio_${index}_${uuidv4()}.mp3`;
    const outputPath = path.join("output", fileName);
    fs.writeFileSync(outputPath, audioBuffer.data);

    console.log(`✅ Generated clip for ${speaker}: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error(`❌ Failed to generate voice for ${speaker}:`, err.message);
    throw err;
  }
};
