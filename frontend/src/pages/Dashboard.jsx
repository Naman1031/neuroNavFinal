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
  Sparkles,
  Brain,
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  X,
  ChevronDown,
  ChevronRight,
  Download,
  Share,
  Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FocusTimer from "../components/FocusTimer.jsx";
import Timetable from "../components/TimeTable.jsx";
import axios from "axios";
import PodcastPanel from "../components/PodcastPanel.jsx";
import QuizBot from "../components/QuizBot.jsx";

// Enhanced Toggle Switch Component
function ToggleSwitch({
  icon,
  title,
  subtitle,
  isActive,
  onToggle,
  activeColor = "bg-gradient-to-r from-emerald-400 to-teal-500",
}) {
  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-300"
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <div>
          <div className="font-semibold text-gray-800 dark:text-white">
            {title}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </div>
        </div>
      </div>
      <motion.button
        onClick={onToggle}
        className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
          isActive ? activeColor : "bg-gray-300 dark:bg-gray-600"
        } shadow-inner`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-6 h-6 bg-white rounded-full shadow-lg absolute top-1"
          animate={{
            x: isActive ? 32 : 4,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </motion.button>
    </motion.div>
  );
}

// Enhanced Stats Card Component
function StatsCard({ icon, title, value, subtitle, gradient, delay = 0 }) {
  return (
    <motion.div
      className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
          <motion.div
            className="text-3xl font-bold"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: delay + 0.3, ease: "easeOut" }}
          >
            {value}
          </motion.div>
        </div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function NeuroNavApp() {
  const [showTimetable, setShowTimetable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("friendly");
  const [clicked, setClicked] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState("summary");
  const [quiz, setQuiz] = useState("not");
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(80);
  const [streak, setStreak] = useState(7);
  const [attentionSpan, setAttentionSpan] = useState(85);
  const [summarizedParagraphs, setSummarizedParagraphs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [podcastAudioUrl, setPodcastAudioUrl] = useState("");
  const [podcastScript, setPodcastScript] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [show, setShow] = useState(false);
  const fileInputRef = useRef();

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleCardExpansion = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  useEffect(() => {
    const storedCompleted = localStorage.getItem("completedFocusTasks");
    if (storedCompleted) {
      setCompletedTasks(Number(storedCompleted));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("completedFocusTasks", completedTasks);
  }, [completedTasks]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // API Functions with proper error handling
  const handleGeneratePodcast = async () => {
    try {
      setIsProcessing(true);
      const formData = new FormData();

      if (uploadedFile) {
        formData.append("pdfData", uploadedFile);
      }
      if (textInput.trim()) {
        formData.append("prompt", textInput);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/data/podcast`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      setPodcastAudioUrl(`${import.meta.env.VITE_BASE_URL}/${data.audioPath}`);
      setPodcastScript(data.script || []);
    } catch (err) {
      console.error("Podcast generation error:", err);
      alert("Failed to generate podcast. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processcontent = async () => {
    if (!textInput.trim() && !uploadedFile) {
      alert("Please provide content to process!");
      return;
    }
    setShow(true);
    setClicked(true);
    setIsProcessing(true);

    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }
      if (textInput.trim()) {
        formData.append("prompt", textInput);
      }

      // Parallel API calls for better performance
      const [summaryResponse, quizResponse] = await Promise.all([
        axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/data/summarize`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
        axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/data/prompt`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
      ]);

      const summaryData = summaryResponse.data;
      const quizData = quizResponse.data;

      setQuiz(quizData);

      // Fixed data processing - handle different response structures
      const keyPoints =
        summaryData.keyPointsArray || summaryData.keyPoints || [];
      const paragraphs =
        summaryData.textWithAudioArray || summaryData.summaries || [];

      console.log("Summary Data:", summaryData); // Debug log
      console.log("Key Points:", keyPoints); // Debug log
      console.log("Paragraphs:", paragraphs); // Debug log

      const formattedParagraphs = paragraphs.map((summary, index) => ({
        id: index,
        title: `Section ${index + 1}`,
        summary: typeof summary === "string" ? { paragraph: summary } : summary,
        keyPoints: keyPoints,
      }));

      setSummarizedParagraphs(formattedParagraphs);

      // Generate podcast after successful summarization
      await handleGeneratePodcast();
    } catch (error) {
      console.error("API Error:", error);
      alert("Processing failed. Please check your connection and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, Word document, or text file.");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB.");
        return;
      }

      setUploadedFile(file);
    } catch (error) {
      console.error("File upload error:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const playAudio = (audioUrl) => {
    try {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        alert("Audio playback failed. Please try again.");
      });
    } catch (error) {
      console.error("Audio error:", error);
    }
  };

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white"
    : "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-gray-900";

  const cardClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-800/95 to-indigo-800/95 border-slate-600/50 backdrop-blur-xl text-white"
    : "bg-gradient-to-br from-white/95 to-emerald-50/95 border-emerald-200/50 backdrop-blur-xl";

  const fontClass = dyslexicFont ? "font-dyslexic" : "font-sans";

  return (
    <motion.div
      className={`min-h-screen ${themeClasses} ${fontClass} transition-all duration-700`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Navbar */}
      <motion.div
        className="sticky top-0 z-40 flex items-center justify-between p-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20 shadow-lg"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Brain className="w-9 h-9 text-white" />
          </motion.div>
          <div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              NeuroNav
            </motion.h1>
            <motion.p
              className={`text-sm ${
                isDarkMode ? "text-slate-300" : "text-gray-600"
              } font-medium`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              AI-Powered Learning Companion
            </motion.p>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.div
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 rounded-full shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Target className="w-4 h-4" />
            <span className="font-semibold">Focus: {attentionSpan}%</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-full shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Flame className="w-4 h-4" />
            <span className="font-semibold">{streak} day streak</span>
          </motion.div>
        </div>

        {/* Enhanced Settings */}
        <div className="flex items-center space-x-4 relative">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-4 rounded-2xl ${
              isDarkMode
                ? "bg-slate-700/80 hover:bg-slate-600/80"
                : "bg-white/80 hover:bg-gray-50/80"
            } shadow-lg transition-all duration-300 backdrop-blur-sm`}
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-6 h-6" />
          </motion.button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                className={`absolute right-0 top-20 w-96 ${cardClasses} shadow-2xl rounded-3xl p-8 border z-50`}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Accessibility Settings
                  </h2>
                  <motion.button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
                <div className="space-y-6">
                  <ToggleSwitch
                    icon={<Eye className="w-5 h-5 text-emerald-600" />}
                    title="Dyslexic Font"
                    subtitle="Easier reading experience"
                    isActive={dyslexicFont}
                    onToggle={() => setDyslexicFont(!dyslexicFont)}
                  />
                  <ToggleSwitch
                    icon={<Moon className="w-5 h-5 text-indigo-600" />}
                    title="Dark Mode"
                    subtitle="Better contrast & eye comfort"
                    isActive={isDarkMode}
                    onToggle={toggleDarkMode}
                    activeColor="bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Enhanced Stats Dashboard */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <StatsCard
              icon={<TrendingUp className="w-7 h-7" />}
              title="Learning Progress"
              value="85%"
              subtitle="This week's improvement"
              gradient="from-emerald-500 to-teal-600"
              delay={0}
            />
            <StatsCard
              icon={<Clock className="w-7 h-7" />}
              title="Focus Time"
              value="4.2h"
              subtitle="Today's focused learning"
              gradient="from-blue-500 to-indigo-600"
              delay={0.1}
            />
            <StatsCard
              icon={<CheckCircle className="w-7 h-7" />}
              title="Tasks Completed"
              value={`${completedTasks}`}
              subtitle="This week's achievements"
              gradient="from-purple-500 to-pink-600"
              delay={0.2}
            />
          </motion.div>

          {/* Enhanced Smart Learning Hub */}
          <motion.div
            className={`${cardClasses} rounded-3xl p-8 border shadow-2xl`}
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center space-x-4 mb-8">
              <motion.div
                className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Smart Learning Hub
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  } mt-1`}
                >
                  Transform any content into personalized learning experiences
                </p>
              </div>
            </div>

            {/* Enhanced File Upload Area */}
            <motion.div
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-600 rounded-3xl p-12 text-center mb-8 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-500 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Upload className="w-12 h-12 text-white" />
              </motion.div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">
                  Drop your content here or browse
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  } mb-8 max-w-md mx-auto leading-relaxed`}
                >
                  PDFs, Word docs, or plain text • AI will optimize it for your
                  learning style and neurodiversity needs
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-5 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center space-x-3">
                    {isUploading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Choose File</span>
                      </>
                    )}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {uploadedFile && (
                    <motion.div
                      className="mt-6 p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>{uploadedFile.name} uploaded successfully</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Enhanced Text Input Area */}
            <div className="mb-8">
              <motion.textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or paste your text here… I'll help make it perfect for your brain! 🧠✨"
                className={`w-full h-48 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 focus:outline-none resize-none transition-all duration-500 ${
                  isDarkMode
                    ? "bg-slate-700/50 text-white placeholder-slate-400"
                    : "bg-white/80 placeholder-gray-500"
                } backdrop-blur-sm text-lg leading-relaxed`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* FIXED: Reduced Transform Button Animation */}
            <motion.button
              onClick={processcontent}
              disabled={isProcessing || (!textInput.trim() && !uploadedFile)}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-6 rounded-3xl font-bold text-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />

              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.span
                    key="processing"
                    className="flex items-center justify-center relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-7 h-7 border-3 border-white border-t-transparent rounded-full mr-4"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Processing Your Content...
                  </motion.span>
                ) : (
                  <motion.span
                    key="transform"
                    className="flex items-center justify-center relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles className="w-7 h-7 mr-4" />✨ Transform My Content
                    ✨
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* FIXED: Enhanced Content Display */}
          <AnimatePresence>
            {clicked && summarizedParagraphs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                {/* Enhanced Toggle Buttons */}
                <motion.div
                  className="flex space-x-4 mb-8"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {[
                    { key: "summary", label: "📄 Summary", icon: FileText },
                    { key: "keyPoints", label: "🎯 Key Points", icon: Target },
                  ].map((tab, index) => (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveContentTab(tab.key)}
                      className={`flex-1 py-5 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
                        activeContentTab === tab.key
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl transform scale-105"
                          : `${
                              isDarkMode
                                ? "bg-slate-700/80 text-slate-300 hover:bg-slate-600/80"
                                : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80"
                            } backdrop-blur-sm`
                      }`}
                      variants={itemVariants}
                      whileHover={{
                        scale: activeContentTab === tab.key ? 1.05 : 1.02,
                        y: -2,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Enhanced Content Cards */}
                <motion.div
                  className="space-y-8"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {console.log("Summarized Paragraphs:", summarizedParagraphs)}

                  {summarizedParagraphs.map((item, index) => {
                    // Set default expansion state for cards
                    const isExpanded = expandedCards[item.id] !== false;

                    return (
                      <motion.div
                        key={item.id}
                        className={`${cardClasses} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border`}
                        variants={cardVariants}
                        whileHover="hover"
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Enhanced Card Header */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 px-8 py-6 border-b border-emerald-200/50 dark:border-emerald-700/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <motion.div
                                className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {index + 1}
                              </motion.div>
                              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {item.title}
                              </h3>
                            </div>
                            <motion.button
                              onClick={() => toggleCardExpansion(item.id)}
                              className="p-3 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 rounded-xl transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.div
                                animate={{
                                  rotate: isExpanded ? 90 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronRight className="w-6 h-6" />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>

                        {/* Enhanced Card Content - Always show by default */}
                        <motion.div
                          className="p-8"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <AnimatePresence mode="wait">
                            {activeContentTab === "summary" ? (
                              <motion.div
                                key="summary"
                                className="space-y-6"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.4 }}
                              >
                                <p
                                  className={`${
                                    isDarkMode
                                      ? "text-slate-300"
                                      : "text-gray-700"
                                  } leading-relaxed text-lg`}
                                >
                                  {console.log("Item summary:", item.summary)}
                                  {typeof item.summary === "string"
                                    ? item.summary
                                    : item.summary?.paragraph ||
                                      "No summary available"}
                                </p>
                                {item.summary?.audioFile && (
                                  <motion.div
                                    className="flex items-center space-x-4 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <motion.button
                                      onClick={() =>
                                        playAudio(item.summary.audioFile)
                                      }
                                      className="flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <PlayCircle className="w-6 h-6" />
                                      <span>Play Audio</span>
                                    </motion.button>
                                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                                      <motion.div
                                        className="w-3 h-3 bg-emerald-500 rounded-full"
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{
                                          duration: 1.5,
                                          repeat: Infinity,
                                        }}
                                      />
                                      <span className="text-sm font-medium">
                                        Audio ready
                                      </span>
                                    </div>
                                  </motion.div>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="keypoints"
                                className="space-y-4"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4 }}
                              >
                                {console.log("Item keyPoints:", item.keyPoints)}
                                {item.keyPoints &&
                                Array.isArray(item.keyPoints) &&
                                item.keyPoints.length > 0 ? (
                                  item.keyPoints.map((point, pointIndex) => (
                                    <motion.div
                                      key={pointIndex}
                                      className="flex items-start space-x-4 p-5 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 group"
                                      initial={{ opacity: 0, x: -30 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: pointIndex * 0.1 }}
                                      whileHover={{ scale: 1.02, x: 10 }}
                                    >
                                      <motion.div
                                        className="flex-shrink-0 mt-2"
                                        whileHover={{ scale: 1.3 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:shadow-lg transition-all duration-300"></div>
                                      </motion.div>
                                      <p
                                        className={`${
                                          isDarkMode
                                            ? "text-slate-300"
                                            : "text-gray-700"
                                        } leading-relaxed text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300`}
                                      >
                                        {point}
                                      </p>
                                    </motion.div>
                                  ))
                                ) : (
                                  <p
                                    className={`${
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                    } text-center py-8`}
                                  >
                                    No key points available for this section.
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        {/* Enhanced Card Footer */}
                        <div
                          className={`${
                            isDarkMode ? "bg-slate-800/50" : "bg-gray-50/80"
                          } px-8 py-5 border-t ${
                            isDarkMode ? "border-slate-700" : "border-gray-200"
                          } backdrop-blur-sm`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold ${
                                isDarkMode ? "text-slate-300" : "text-gray-600"
                              } flex items-center space-x-2`}
                            >
                              {activeContentTab === "summary" ? (
                                <>
                                  <FileText className="w-4 h-4" />
                                  <span>Summary View</span>
                                </>
                              ) : (
                                <>
                                  <Target className="w-4 h-4" />
                                  <span>
                                    {item.keyPoints &&
                                    Array.isArray(item.keyPoints)
                                      ? item.keyPoints.length
                                      : 0}{" "}
                                    Key Points
                                  </span>
                                </>
                              )}
                            </span>
                            <div className="flex items-center space-x-2">
                              {["summary", "keyPoints"].map((tab, tabIndex) => (
                                <motion.div
                                  key={tab}
                                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    activeContentTab === tab
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
                                      : isDarkMode
                                      ? "bg-slate-600"
                                      : "bg-gray-300"
                                  }`}
                                  whileHover={{ scale: 1.3 }}
                                  transition={{ duration: 0.2 }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Quiz Section */}
          <AnimatePresence>
            {quiz !== "not" && (
              <motion.div
                className={`${cardClasses} rounded-3xl p-8 border shadow-2xl`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <QuizBot quiz={quiz} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Podcast Panel */}
          {show && !isProcessing && (
            <motion.div variants={itemVariants}>
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
            </motion.div>
          )}
        </div>

        {/* Enhanced Right Sidebar */}
        <motion.div
          className="w-full lg:w-96 space-y-6"
          variants={itemVariants}
        >
          <FocusTimer
            isDarkMode={isDarkMode}
            cardClasses={cardClasses}
            streak={streak}
            setStreak={setStreak}
            attentionSpan={attentionSpan}
            setAttentionSpan={setAttentionSpan}
            setShowTimetable={setShowTimetable}
          />
        </motion.div>

        {/* Enhanced Timetable Modal */}
        <AnimatePresence>
          {showTimetable && (
            <Timetable
              isOpen={showTimetable}
              onClose={() => setShowTimetable(false)}
              setCompletedTasks={setCompletedTasks}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
