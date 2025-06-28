// src/components/FocusTimer.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Timer, Play, Square, RotateCcw, Flame, Calendar } from "lucide-react";
import FaceDetectionMini from "../pages/FaceDetectionMini.jsx";

const getMinutesFromAnswer = (answer) => {
  switch (answer) {
    case "15-20 mins":
      return 15;
    case "20-30 mins":
      return 20;
    case "30-45 mins":
      return 30;
    case ">45 mins":
      return 45;
    default:
      return 1;
  }
};

const FocusTimer = ({
  isDarkMode,
  cardClasses,
  setStreak,
  streak,
  attentionSpan,
  setAttentionSpan,
  setShowTimetable,
}) => {
  const [hardCodedTime, setHardCodedTime] = useState(1);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const goalAchievedRef = useRef(false);
  const faceRef = useRef();

  useEffect(() => {
    const savedMinutes = localStorage.getItem("focusTimerMinutes");
    if (savedMinutes) {
      setTimerMinutes(parseInt(savedMinutes, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focusTimerMinutes", timerMinutes);
  }, [timerMinutes]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/getSurvey`,
          {
            withCredentials: true,
          }
        );
        const surveyData = res.data?.surveyData || [];

        const focusAnswerObj = surveyData.find(
          (query) =>
            query.question === "How long can you stay focused on a single task?"
        );

        if (focusAnswerObj?.answer) {
          const minutes = getMinutesFromAnswer(focusAnswerObj.answer);
          setHardCodedTime(minutes);
        }
      } catch (err) {
        console.error("Failed to fetch survey data", err);
      }
    };

    fetchSurveyData();
  }, []);

  useEffect(() => {
    let timer;
    const milestoneTime = hardCodedTime * 60; // e.g. 60 seconds
    const fullDuration = hardCodedTime * 60 * 6; // e.g. 6 mins

    if (isTimerRunning && timerMinutes < fullDuration) {
      timer = setInterval(() => {
        setTimerMinutes((prev) => {
          const next = prev + 1;

          // Trigger streak once at milestone
          if (next === milestoneTime && !goalAchievedRef.current) {
            goalAchievedRef.current = true;
            setStreak((prev) => prev + 1); // Parent handles localStorage
          }

          // Stop at full duration
          if (next >= fullDuration) {
            setIsTimerRunning(false);
            faceRef.current?.stopDetection();
          }

          return next;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, hardCodedTime]);

  const handleStart = () => {
    setIsTimerRunning(true);
    faceRef.current?.startDetection();
  };

  const handlePause = () => {
    setIsTimerRunning(false);
    faceRef.current?.stopDetection();
  };

  const handleReset = () => {
    setTimerMinutes(0);
    localStorage.removeItem("focusTimerMinutes");
    setIsTimerRunning(false);
    goalAchievedRef.current = false;
    faceRef.current?.stopDetection();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <>
      <div
        className={`${cardClasses} backdrop-blur-sm rounded-2xl p-6 border shadow-xl`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Focus Timer</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-purple-500 mb-2">
            {formatTime(timerMinutes)}
          </div>
          <div className="text-sm opacity-75 mb-4">Deep focus time today</div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Daily Goal</div>
            <div className="text-lg font-bold">{hardCodedTime * 6} min</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    (timerMinutes / (hardCodedTime * 60 * 6)) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="text-xs opacity-75 mt-1">
              {Math.floor((timerMinutes / (hardCodedTime * 60 * 6)) * 100)}%
              complete
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {!isTimerRunning ? (
            <button
              onClick={handleStart}
              className="bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-orange-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-yellow-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <div className="relative left-16 mx-auto">
          <button
            onClick={() => setShowTimetable(true)}
            className="bg-purple-500 text-white shadow-lg transform scale-[1.02] px-4 py-2 rounded-lg hover:bg-purple-800 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Timetable</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm relative top-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-medium">Streak:</span>
          <span className="font-bold">{streak} days</span>
        </div>

        
      </div>

      <FaceDetectionMini
        ref={faceRef}
        setAttentionSpan={setAttentionSpan}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default FocusTimer;
