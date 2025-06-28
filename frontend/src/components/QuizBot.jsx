import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const REACT_APP_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;
const ai = new GoogleGenerativeAI(REACT_APP_GEMINI_API_KEY);

const QuizBot = ({ quiz }) => {
  const pdf = quiz.pdfData || "";
  const prompt = quiz.prompt || "";
  const studyNotes = pdf + prompt;
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [end, setEnd] = useState(false);

  const bottomRef = useRef(null);

  // useEffect(() => {
  //   if (bottomRef.current) {
  //     bottomRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [chatHistory]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser. Use Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setIsListening(false);
      await handleQuiz(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error: " + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleQuiz = async (userInput) => {
    const newHistory = [...chatHistory, { role: "user", content: userInput }];
    setChatHistory(newHistory);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const historyText = newHistory
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Bot"}: ${
              typeof msg.content === "string"
                ? msg.content
                : msg.content?.speech
            }`
        )
        .join("\n");

      let prompt = isWaitingForAnswer
        ? `You're an educational quiz bot designed for learners with ADHD or dyslexia.

Study Material:
"""
${studyNotes}
"""

Here is the conversation so far:
${historyText}

The user has answered the previous question.

Instructions:
1. First say clearly if the answer was right or wrong.
2. If right: say “Yes! That’s correct.” and give a very short reason (1 sentence).
3. If wrong: say “Oops! That’s not correct.” and then give a simple explanation using basic words (2 short sentences max).
4. Avoid long or complicated explanations.
5. Then say: “Are you ready for the next question?”

Keep your tone friendly, calm, and supportive. Respond simply.`
        : `You're an educational quiz bot for students with ADHD and dyslexia.

Study Material:
"""
${studyNotes}
"""

Conversation so far:
${historyText}

Ask one short quiz question in simple words. Use a multiple choice format (A, B, C, D).  
Example: “What do plants need to make food?  
A.Sunlight  
  B.Plastic  
C.Rocks  
D.Sugar”

Only ask one question. Do not evaluate the answer yet.
Generate one multiple choice question. Return only a raw JSON object, no explanation, no markdown, no code block.
give the response in the following json format:
{
  speech:This field will contain the question with options in a line to convert to speech which the user can understaand,
  question:the question,
  options:An array of options,
  answer: the correct answer (like "A", "B", etc.")
}`;

      if (userInput === "end") {
        setEnd(true);
        prompt = `You're an educational quiz bot designed for learners with ADHD or dyslexia.

Study Material:
"""
${studyNotes}
"""

Here is the conversation so far:
${historyText}

The user has ended the quiz and now dezire an analysis.

Instructions:
1) Give the total score the user made like 5 out of 10 or 6 out of 10.
2) Give him consolense or appraisal based on his performance.
3) Give him suggetions on what to focus on and what can be improved.
4) Keep your tone friendly, calm, and supportive. Use emojis for expression.
5) Just 3 lines maximum
`;
      }

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      if (!isWaitingForAnswer && userInput !== "end") {
        const cleanJson = JSON.parse(
          response.replace(/```json|```/g, "").trim()
        );
        speak(cleanJson.speech);
        setChatHistory([...newHistory, { role: "bot", content: cleanJson }]);
      } else {
        speak(response);
        setChatHistory([...newHistory, { role: "bot", content: response }]);
      }

      setIsWaitingForAnswer(!isWaitingForAnswer);
    } catch (err) {
      console.error("Gemini error:", err);
      speak("Sorry, something went wrong.");
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-[500px] flex flex-col">
      {/* <textarea
        rows={3}
        className="w-full resize-none p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2 text-gray-700"
        placeholder="Paste your study notes here..."
        value={studyNotes}
        // onChange={(e) => setStudyNotes(e.target.value)}
      /> */}

      {transcript && (
        <p className="text-sm text-gray-600 mb-1 px-1">
          <strong>You:</strong> {transcript}
        </p>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-400">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`transform-gpu p-3 rounded-xl shadow transition-transform duration-300 ease-in-out text-sm ${
              msg.role === "user" ? "bg-cyan-100" : "bg-yellow-100"
            }`}
          >
            <strong className="block mb-2 text-gray-800">
              {msg.role === "user" ? "🧑 You" : "🤖 Bot"}:
            </strong>

            {typeof msg.content === "string" ? (
              <p className="text-gray-800">{msg.content}</p>
            ) : (
              <div>
                <p className="font-semibold mb-2 text-indigo-700">
                  🧠 <strong>Question:</strong> {msg.content.question}
                </p>
                <div className="flex flex-col gap-2">
                  {msg.content.options.map((opt, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    return (
                      <label
                        key={label}
                        className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:shadow transition"
                      >
                        <input
                          type="radio"
                          name={`quiz-${i}`}
                          value={label}
                          className="form-radio text-blue-600"
                          onClick={() => handleQuiz(label)}
                        />
                        <span className="font-medium">{label}.</span>
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Buttons */}
      <div className="mt-2 flex flex-wrap gap-2 justify-between">
        {chatHistory.length === 0 ? (
          <button
            onClick={() => handleQuiz("Start Quiz")}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition text-sm"
          >
            Start Quiz
          </button>
        ) : (
          <>
            {!isWaitingForAnswer && (
              <button
                onClick={() => handleQuiz("Yes!")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition ${
                  isListening
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Yes!
              </button>
            )}
            {!end && (
              <button
                onClick={() => handleQuiz("end")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition ${
                  isListening
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                End Quiz
              </button>
            )}
            <button
              onClick={startListening}
              disabled={isListening}
              className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition ${
                isListening
                  ? "bg-red-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isListening ? "🎙️ Listening..." : "🎤 Tap to speak"}
            </button>
          </>
        )}
        {end && (
          <button
            onClick={() => {
              setChatHistory([]);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold `}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizBot;
