import fs from "fs";
import pdfParse from "pdf-parse-new";

const parsePdf = async (req, res, next) => {
  try {
      if (!req.file || !req.file.path) {
  // No file uploaded, just continue to next middleware
  return next();
}

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    // Saving parsed text to a file in same directory

    console.log("PDF converted successfully!");
    req.body.pdfData = data.text;

    next();
  } catch (err) {
    console.error("Error parsing PDF:", err);
    res
      .status(500)
      .json({ message: "Couldn't parse the file! Internal Server Error!" });
  }
};

export default parsePdf;
