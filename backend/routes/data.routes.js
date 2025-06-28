import express from "express";
import upload from "../middlewares/multer.middleware.js";
import parsePdf from "../middlewares/pdfParse.middleware.js";
import { quiz } from "../controllers/quiz.controller.js";

import generatePodcastDialog from "../controllers/podcast.controller.js";
import { Summarize} from "../controllers/summarized.controller.js";

const router = express.Router();

// router.get("/prompt", promptController);

// router.get("/prompt", promptController);
//router.post("/keyConcepts",upload.single("file"),parsePdf,keyConcepts);
router.post("/summarize",upload.single("file"),parsePdf,Summarize );
router.post("/podcast",upload.single("pdfData"), parsePdf, generatePodcastDialog);

router.post("/quiz", upload.single("file"), parsePdf, quiz);

export default router;