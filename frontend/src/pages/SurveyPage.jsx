import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const surveyQuestions = [
  {
    question: "Do you have ADHD or Dyslexia?",
    options: ["ADHD", "Dyslexia", "Both", "None"],
  },
  {
    question: "What is your age group?",
    options: ["<13", "13-18", "19-30", ">30"],
  },
  {
    question: "How long can you stay focused on a single task?",
    options: ["15-20 mins", "20-30 mins", "30-45 mins", ">45 mins"],
  },
  {
    question: "What are your biggest distractions?",
    options: ["Noise", "Social Media", "Boredom", "Physical Restlessness"],
  },
  {
    question: "What time of day are you most productive?",
    options: ["Morning", "Evening", "Night", "Varies"],
  },
  {
    question: "How many breaks do you take?",
    options: ["None", "1-2", "3-5", ">5"],
  },
  {
    question: "How long are your breaks?",
    options: ["<5 mins", "5-10 mins", "10-20 mins", ">20 mins"],
  },
];

const SurveyPage = () => {
  const [answers, setAnswers] = useState(
    Array(surveyQuestions.length).fill("")
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log(user);

  const handleSelect = (questionIndex, option) => {
    const updated = [...answers];
    updated[questionIndex] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const surveyData = surveyQuestions.map((q, index) => ({
      question: q.question,
      answer: answers[index],
    }));

    console.log("User Details:", location.state);
    console.log("Survey Answers:", surveyData);

    try {
      await axios.post("http://localhost:5000/api/users/survey", {
        surveyData: surveyData,
      },{withCredentials:true});

      navigate("/dashboard");
    } catch (error) {
      console.error("Survey submission failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-300 to-pink-400 flex flex-col items-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8"
      >
        <h2 className="text-4xl font-bold text-center text-pink-600 mb-8">
          Quick Survey 🎯
        </h2>

        <div className="space-y-8">
          {surveyQuestions.map((item, index) => (
            <div key={index}>
              <p className="text-lg font-semibold mb-3 text-gray-800">
                {index + 1}. {item.question}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {item.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(index, opt)}
                    className={`py-2 px-4 rounded-full border text-sm font-medium transition-all duration-200 ${
                      answers[index] === opt
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-pink-500"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-10 w-full py-3 rounded-xl bg-pink-600 text-white text-lg font-semibold hover:bg-pink-700 transition-all"
        >
          Submit Survey ✅
        </button>
      </motion.div>
    </div>
  );
};

export default SurveyPage;
