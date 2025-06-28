import dotenv from "dotenv";
dotenv.config();


export const quiz = async (req, res) => {
  const { prompt, pdfData } = req.body;

  if (!prompt && !pdfData) {
    return res
      .status(400)
      .json({ error: "Either prompt or PDF data is required." });
  }

  try {
    res.status(200).json({prompt,pdfData});
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
};