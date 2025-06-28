import { useState, useEffect, useRef } from "react";
import {
  Upload,
  BookOpen,
  Settings,
  Play,
  Square,
  Mic,
  Timer,
  Eye,
  Moon,
  Focus,
  Zap,
  FileText,
  Volume2,
  RotateCcw,
  Flame,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Calendar,
} from "lucide-react";
import FocusTimer from "../components/FocusTimer.jsx";
import Timetable from "../components/TimeTable.jsx";
import axios from "axios";
import PodcastPanel from "../components/PodcastPanel.jsx";

//podcast
import QuizBot from "../components/QuizBot.jsx";

// toggle for navbar
function ToggleSwitch({
  icon,
  title,
  subtitle,
  isActive,
  onToggle,
  activeColor = "bg-yellow-400",
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm opacity-75">{subtitle}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors ${
          isActive ? activeColor : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            isActive ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function NeuroNavApp() {
  const [showTimetable, setShowTimetable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("friendly");
  const [clicked, setClicked] = useState(false)
  const [activeContentTab, setActiveContentTab] = useState("summary");
  const [quiz, setQuiz] = useState("not");
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(80);
  const [streak, setStreak] = useState(0);
  const [attentionSpan, setAttentionSpan] = useState(null);
  const [summarizedParagraphs, setSummarizedParagraphs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const speechSynthesis = window.speechSynthesis;
  const fileInputRef = useRef();
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const [podcastAudioUrl, setPodcastAudioUrl] = useState("");
  const [podcastScript, setPodcastScript] = useState([]);

  const handleGeneratePodcast = async () => {
    try {
      const formData = new FormData();
      console.log(formData);

      if (uploadedFile) {
        formData.append("pdfData", uploadedFile);
      }

      formData.append("prompt", textInput || "");

      const response = await axios.post(
        "http://localhost:5000/api/data/podcast",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      setPodcastAudioUrl(`http://localhost:5000/${data.audioPath}`);
      setPodcastScript(data.script);
    } catch (err) {
      console.error("Podcast error", err);
      alert("Failed to generate podcast.");
    }
  };

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-black"
    : "bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 text-gray-900";

  const cardClasses = isDarkMode
    ? "bg-gray-800/50 border-gray-700 text-white"
    : "bg-white/80 border-gray-200";

  const fontClass = dyslexicFont ? "font-dyslexic" : "font-sans";

  // File handling
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      handleFileRead(file);
    }
  };

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => {
      console.error("Playback failed:", err);
    });
  };

  const handleFileRead = async (file) => {
    setIsProcessing(true);
    try {
      let text = "";

      if (file.type === "application/pdf") {
        // For PDF files, we'll simulate reading the content
        // In a real implementation, you'd use a PDF parsing library
        text =
          "This is a sample PDF content. In a real implementation, you would use a PDF parsing library like pdf-parse or PDF.js to extract text from the PDF file. This content would then be processed and summarized into digestible paragraphs for better learning.";
      } else if (file.type === "text/plain" || file.type.includes("text")) {
        text = await file.text();
      } else {
        alert("Please upload a text file or PDF");
        setIsProcessing(false);
        return;
      }

      // Combine file content with text input
      const combinedText = [text, textInput].filter(Boolean).join("\n\n");
      await processcontent(combinedText);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processcontent = async () => {
    if (!textInput.trim() && !uploadedFile) {
      alert("Please provide content to process!");
      return;
    }
    setClicked(true)
    setIsProcessing(true);
    try {
      const formData = new FormData();
      if (uploadedFile) formData.append("file", uploadedFile);
      if (textInput.trim()) formData.append("prompt", textInput);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/data/summarize`,
        formData,
        { withCredentials: true }
      );
      const response1 = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/data/prompt`,
        formData,
        { withCredentials: true }
      );
      setQuiz(response1.data);
      console.log(response1.data);

      const data = response.data;

      const keyPoints = data.keyPointsArray;
      const paragraphs = data.textWithAudioArray;
      console.log(keyPoints);

      const formattedParagraphs = paragraphs.map((summary, index) => ({
        id: index,
        title: `Section ${index + 1}`,
        summary: summary,
        keyPoints: keyPoints,
      }));

      setSummarizedParagraphs(formattedParagraphs);
      await handleGeneratePodcast();
    } catch (error) {
      console.error("API Error:", error);
      alert("Summarization failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${themeClasses} ${fontClass} transition-all duration-300`}
    >
      {/* Navbar */}
      <div className="flex items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              className={
                isDarkMode
                  ? "text-2xl font-bold text-white"
                  : "text-2xl font-bold"
              }
            >
              NeuroNav
            </h1>
            <p
              className={
                isDarkMode
                  ? "text-sm opacity-75 text-white"
                  : "text-sm opacity-75"
              }
            >
              AI-Powered Learning Companion
            </p>
          </div>
        </div>
        <div className="bg-green-500 ml-auto mr-5 text-white px-4 py-2 rounded-full text-sm font-medium">
          {attentionSpan !== null
            ? ` Attention Span: ${attentionSpan}%`
            : " Focus Mode Ready"}
        </div>

        <div className="flex gap-4 relative">
          {/* <button
            onClick={() => setShowTimetable(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>My Timetable</span>
          </button> */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <Settings className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-8 mt-2 w-64 z-50 bg-white shadow-xl rounded-xl p-4 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Accessibility</h2>
              <div className="space-y-4">
                <ToggleSwitch
                  icon={<Eye className="w-5 h-5 text-emerald-500" />}
                  title="Dyslexic Font"
                  subtitle="Easier reading"
                  isActive={dyslexicFont}
                  onToggle={() => setDyslexicFont(!dyslexicFont)}
                />
                <ToggleSwitch
                  icon={<Moon className="w-5 h-5 text-emerald-500" />}
                  title="Dark Mode"
                  subtitle="Better contrast"
                  isActive={isDarkMode}
                  onToggle={toggleDarkMode}
                  activeColor="bg-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Smart Learning Hub */}
          <div
            className={`${cardClasses} backdrop-blur-sm rounded-2xl p-6 border shadow-xl`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Smart Learning Hub</h2>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center mb-6 hover:border-purple-400 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Drop your content here or browse
              </h3>
              <p className="text-sm opacity-75 mb-4">
                PDFs, Word docs, or plain text • AI will optimize it for your
                learning style
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                ✨ Choose File
              </button>
              {uploadedFile && (
                <p className="text-sm mt-2 text-green-600">
                  ✓ {uploadedFile.name} uploaded
                </p>
              )}
            </div>

            {/* Text Input Area */}
            <div className="mb-6">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or paste your text here… I'll help make it perfect for your brain! 🧠✨"
                className={`w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white"
                }`}
              />
            </div>

            {/* Transform Button */}
            <button
              onClick={processcontent}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Content...
                </span>
              ) : (
                "✨ Transform My Content ✨"
              )}
            </button>
          </div>
          {/* {summarizedParagraphs.length > 0 && (
            <div
              className={`${cardClasses} backdrop-blur-sm rounded-2xl p-6 border shadow-xl`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Summarized Content</h2>
              </div>
               All summaries in one box 
              <div>
                {console.log(summarizedParagraphs)}
                {summarizedParagraphs.map((item, index) => (
                  <div key={item.id} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-purple-600">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => playAudio(item.summary.audioFile)}
                        className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1 text-xs"
                      >
                        <PlayCircle className="w-3 h-3" />
                        <span>Play</span>
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {item.summary.paragraph}
                    </p>

                    Key Points Display
                    {item.keyPoints && item.keyPoints.length > 0 && (
                      <div className="mt-2 ml-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Key Points:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                          {item.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )} */}
          {isProcessing && <div className="w-full max-w-4xl mx-auto">
            {/* Toggle Buttons */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActiveContentTab("summary")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  activeContentTab === "summary"
                    ? "bg-purple-600 text-white shadow-lg transform scale-[1.02]"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveContentTab("keyPoints")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  activeContentTab === "keyPoints"
                    ? "bg-purple-600 text-white shadow-lg transform scale-[1.02]"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Key Points
              </button>
            </div>

            {/* Content Container */}
            <div className="space-y-4">
              {summarizedParagraphs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="transition-all duration-500 ease-in-out">
                      {activeContentTab === "summary" ? (
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {item.summary.paragraph}
                          </p>
                          {item.summary.audioFile && (
                            <div className="flex items-center space-x-3 mt-4">
                              <button
                                onClick={() =>
                                  playAudio(item.summary.audioFile)
                                }
                                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">Play Audio</span>
                              </button>
                              <div className="flex items-center space-x-2 text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm">Audio available</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {item.keyPoints.map((point, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                            >
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:bg-purple-600 transition-colors duration-200"></div>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-base group-hover:text-gray-800 transition-colors duration-200">
                                {point}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-medium">
                        {activeContentTab === "summary"
                          ? "Summary View"
                          : `${item.keyPoints.length} Key Points`}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            activeContentTab === "summary"
                              ? "bg-purple-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            activeContentTab === "keyPoints"
                              ? "bg-purple-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>}
          
          <PodcastPanel
            cardClasses={cardClasses}
            isDarkMode={isDarkMode}
            speed={speed}
            volume={volume}
            setSpeed={setSpeed}
            setVolume={setVolume}
            podcastAudioUrl={podcastAudioUrl}
            scriptLines={podcastScript}
          />

          {quiz !== "not" && (
            <div
              className={`${cardClasses} backdrop-blur-sm rounded-2xl p-6 border shadow-xl`}
            >
              <QuizBot quiz={quiz} />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Focus Timer */}
          <FocusTimer
            isDarkMode={isDarkMode}
            cardClasses={cardClasses}
            streak={streak}
            setStreak={setStreak}
            attentionSpan={attentionSpan}
            setAttentionSpan={setAttentionSpan}
            setShowTimetable={setShowTimetable}
          />
        </div>
        <div>
          {/*Timetable*/}
          <Timetable
            isOpen={showTimetable}
            onClose={() => setShowTimetable(false)}
          />
        </div>
      </div>
    </div>
  );
}
