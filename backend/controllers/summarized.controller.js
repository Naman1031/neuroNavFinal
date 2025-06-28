import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MURF_API_URL = "https://api.murf.ai/v1/speech/generate";

//text to speech function
const textToSpeech = async (paragraph) => {
  try {
    const ttsResponse = await axios.post(
      MURF_API_URL,
      {
        text: paragraph,
        voiceId: "en-US-natalie", // Replace with valid Murf voice ID
      },
      {
        headers: {
          "api-key": process.env.murf_api_key,
          "Content-Type": "application/json",
        },
      }
    );

    const { audioFile } = ttsResponse.data;

    return { paragraph, audioFile };
  } catch (error) {
    console.error("Murf TTS error:", error.response?.data || error.message);
  }
};

export const Summarize = async (req, res) => {
  const prompt = req.body.prompt;
  const pdfData = req.body.pdfData;

  if (!prompt && !pdfData) {
    return res
      .status(400)
      .json({ error: "Prompt and/or PDF content is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contentToTransform =
      prompt && pdfData
        ? `Topic: ${prompt}\n\nContent:\n${pdfData}`
        : prompt
        ? `Topic to transform:\n${prompt}`
        : `Content:\n${pdfData}`;

        //summary prompt
    const summaryResponse = await model.generateContent(`
You are an AI assistant that summarizes academic or informational text.

Please summarize the following content into a clear and concise explanation. Break the content into short, easy-to-understand paragraphs. Each paragraph should be complete and self-contained.

Avoid complex jargon and use a friendly tone. Don't include titles, lists, or markdown formatting.

${contentToTransform}

Output format: Plain text only. Separate paragraphs with double newlines.
    `);
      //key points prompt
    const keyPointsResponse =
      await model.generateContent(`You are an intelligent assistant that extracts key points from academic, informational, or instructional content.

Below is the content to process. It may come from a PDF document or a written user prompt.

Please read the content carefully and generate a list of the most important **key points**. These should be:

- Concise and complete sentences
- Presented as bullet points (plain text only, no markdown)
- Easy to understand
- Accurate and relevant to the main topic

Avoid copying full paragraphs. Focus on summarizing major ideas and facts.

Here is the content:

${contentToTransform}

Return only the bullet points. No titles or extra explanation. Keep the format clean and readable.
`);

    const summary = (await summaryResponse.response).text();
    
    const rawKeyPoints = (await keyPointsResponse.response).text();

    const keyPointsArray = rawKeyPoints
      .split("\n") // split by newline
      .map((point) => point.trim()) // remove extra spaces
      .filter(Boolean); // remove empty lines

    // Split into individual paragraphs
    const paragraphArray = summary
      .split(/\n\s*\n/) // double newlines = paragraph breaks
      .map((p) => p.trim()) // clean up whitespace
      .filter(Boolean); // remove empty strings

    //text to speech function call
    const textWithAudioArray = await Promise.all(
      paragraphArray.map(async (paragraph) => {
        return await textToSpeech(paragraph);
      })
    );

    return res.status(200).json({
      textWithAudioArray,
      keyPointsArray,
    });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to generate summary." });
  }
};
