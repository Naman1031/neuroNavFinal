import express from "express";
import upload from "../middlewares/multer.middleware.js";
import parsePdf from "../middlewares/pdfParse.middleware.js";
import { quiz } from "../controllers/quiz.controller.js";

import generatePodcastDialog from "../controllers/podcast.controller.js";
import { Summarize} from "../controllers/summarized.controller.js";

const router = express.Router();

router.post("/summarize",upload.single("file"),parsePdf,Summarize );
router.post("/podcast",upload.single("file"), parsePdf, generatePodcastDialog);
router.post("/prompt", upload.single("file"), parsePdf, quiz);

export default router;