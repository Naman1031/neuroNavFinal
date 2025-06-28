// mergeAudio.js
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffprobePath from "@ffprobe-installer/ffprobe";

// Set ffmpeg and ffprobe paths from installers
ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

/**
 * Merges a list of audio files into one MP3 file using ffmpeg.
 * @param {string[]} fileList - Array of paths to individual audio files
 * @param {string} outputPath - Path where merged output will be saved
 * @returns {Promise<string>} - Resolves with the output path
 */
export const mergeAudioFiles = (fileList, outputPath) => {
  return new Promise((resolve, reject) => {
    if (!fileList || fileList.length === 0) {
      return reject(new Error("Audio file list is empty."));
    }

    const command = ffmpeg();
    fileList.forEach((filePath) => command.input(filePath));

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    command
      .on("start", () => console.log("🔄 Merging audio files..."))
      .on("end", () => {
        console.log("✅ Audio files merged into:", outputPath);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("❌ Error merging audio:", err.message);
        reject(err);
      })
      .mergeToFile(outputPath, path.join(outputDir, "temp"));
  });
};
