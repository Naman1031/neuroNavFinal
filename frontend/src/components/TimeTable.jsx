import React, { useState, useEffect } from "react";
import { Clock, X, Play, Coffee, Calendar } from "lucide-react";
import axios from "axios";

const Timetable = ({ isOpen, onClose }) => {
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAndGenerateTimetable();
    }
  }, [isOpen]);

  const fetchAndGenerateTimetable = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/getSurvey`,
        {
          withCredentials: true,
        }
      );
      const surveyData = res.data?.surveyData || [];
      const generatedTimetable = generateTimetable(surveyData);
      setTimetableData(generatedTimetable);
    } catch (err) {
      setError(
        "Unable to load survey data. Please complete your learning preferences survey first."
      );
      console.error("Error fetching survey data:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateTimetable = (surveyData) => {
    // Extract survey responses
    const responses = {};
    surveyData.forEach((item) => {
      responses[item.question] = item.answer;
    });

    // Determine productive time and start hour
    const productiveTime =
      responses["What time of day are you most productive?"] || "Morning";
    let startHour = 9; // Default morning
    if (productiveTime.toLowerCase().includes("afternoon")) startHour = 14;
    if (productiveTime.toLowerCase().includes("evening")) startHour = 18;
    if (productiveTime.toLowerCase().includes("night")) startHour = 22;

    // Extract focus duration and break preferences
    const focusDuration =
      responses["How long can you stay focused on a single task?"] ||
      "20-30 mins";
    const breakFrequency = responses["How many breaks do you take?"] || "1-2";
    const breakDuration = responses["How long are your breaks?"] || "5-10 mins";
    const condition = responses["Do you have ADHD or Dyslexia?"] || "ADHD";

    // Parse durations
    let focusMinutes = 25; // Default
    if (focusDuration.includes("15-20")) focusMinutes = 17;
    if (focusDuration.includes("20-30")) focusMinutes = 25;
    if (focusDuration.includes("30-45")) focusMinutes = 35;
    if (focusDuration.includes(">45")) focusMinutes = 50;

    let breakMinutes = 8; // Default
    if (breakDuration.includes("5-10")) breakMinutes = 7;
    if (breakDuration.includes("10-20")) breakMinutes = 15;
    if (breakDuration.includes(">20")) breakMinutes = 20;

    let numberOfBreaks = 2; //Default
    if (breakFrequency.includes("1-2")) numberOfBreaks = 2;
    if (breakFrequency.includes("3-5")) numberOfBreaks = 4;
    if (breakFrequency.includes(">5")) numberOfBreaks = 6;

    // Adjust for ADHD/Dyslexia
    if (condition.includes("ADHD")) {
      focusMinutes = Math.max(15, focusMinutes - 5); // Shorter focus sessions
      breakMinutes += 2; // Slightly longer breaks
    }
    if (condition.includes("Dyslexia")) {
      focusMinutes = Math.max(20, focusMinutes - 3); // Moderate adjustment
      breakMinutes += 1;
    }

    // Generate timetable
    const timetable = [];
    let currentTime = startHour * 60; // Convert to minutes
    const totalSessions = 6; // Generate 8 focus sessions
    let breakCount = 0;

    for (let i = 0; i < totalSessions; i++) {
      // Focus session
      const focusStart = formatTime(currentTime);
      currentTime += focusMinutes;
      const focusEnd = formatTime(currentTime);

      timetable.push({
        id: `focus-${i}`,
        type: "focus",
        startTime: focusStart,
        endTime: focusEnd,
        duration: focusMinutes,
        title: `Focus Session ${i + 1}`,
        description: "Deep work time - minimize distractions",
      });

      // Break session (except after last focus session)
      if (breakCount <= numberOfBreaks) {
        const breakStart = formatTime(currentTime);
        currentTime += breakMinutes;
        const breakEnd = formatTime(currentTime);

        timetable.push({
          id: `break - ${breakCount}`,
          type: "break",
          startTime: breakStart,
          endTime: breakEnd,
          duration: breakMinutes,
          title: `Break ${breakCount + 1}`,
          description: "Rest and recharge",
        });
        breakCount += 1;
      }
    }

    return timetable;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEnterFocusMode = (session) => {
    // This would trigger the focus mode functionality
    console.log("Entering focus mode for:", session);
    // You can integrate this with your existing focus timer
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  Your Personalized Timetable
                </h2>
                <p className="text-purple-100">
                  AI-optimized for your learning style
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:text-black hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">
                Generating your personalized timetable...
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && timetableData.length > 0 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">
                  📚 Today's Study Plan
                </h3>
                <p className="text-sm text-purple-600">
                  Your timetable is personalized based on your learning
                  preferences and focus patterns.
                </p>
              </div>

              {timetableData.map((session, index) => (
                <div
                  key={session.id}
                  className={`rounded-xl p-4 border-l-4 transition-all duration-200 hover:shadow-md ${
                    session.type === "focus"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500"
                      : "bg-gradient-to-r from-pink-50 to-rose-50 border-l-pink-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-full ${
                          session.type === "focus"
                            ? "bg-green-100 text-green-600"
                            : "bg-pink-100 text-pink-600"
                        }`}
                      >
                        {session.type === "focus" ? (
                          <Play className="w-5 h-5" />
                        ) : (
                          <Coffee className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-bold text-gray-800">
                            {session.startTime} – {session.endTime}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              session.type === "focus"
                                ? "bg-green-100 text-green-700"
                                : "bg-pink-100 text-pink-700"
                            }`}
                          >
                            {session.duration} min
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mt-1">
                          {session.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {session.description}
                        </p>
                      </div>
                    </div>

                    {session.type === "focus" && (
                      <button
                        onClick={() => handleEnterFocusMode(session)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                      >
                        <Play className="w-4 h-4" />
                        <span className="font-medium">Start Focus</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer tip */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-purple-800 mb-2">
                  💡 Pro Tips
                </h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Prepare your materials before each focus session</li>
                  <li>• Use breaks to move around and hydrate</li>
                  <li>• Adjust your environment to minimize distractions</li>
                  <li>• Track your progress to optimize future sessions</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
