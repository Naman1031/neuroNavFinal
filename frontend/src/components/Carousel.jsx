import { motion, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const carouselItems = [
  {
    label: "ADHD Prevalence",
    detail: "Affects ~10.5% of children globally. Symptoms persist in ~60–70% of adults.",
    icon: "🧠",
    accent: "from-blue-500 to-purple-600"
  },
  {
    label: "Dyslexia Prevalence", 
    detail: "10–15% of the global population affected. 80% of LDs involve dyslexia.",
    icon: "📚",
    accent: "from-emerald-500 to-teal-600"
  },
  {
    label: "ADHD (16+)",
    detail: "Hyperactivity often decreases; inattention persists. Some develop late-onset ADHD symptoms.",
    icon: "⚡",
    accent: "from-orange-500 to-red-600"
  },
  {
    label: "Dyslexia (16+)",
    detail: "Reading slower and less fluent. Struggles with complex text, time management, self-esteem.",
    icon: "🎯",
    accent: "from-pink-500 to-rose-600"
  },
  {
    label: "Face Detection (ADHD)",
    detail: "Eye-tracking AUC up to 0.89. ADHD users show reduced visual focus. QbTest clinically validated.",
    icon: "👁️",
    accent: "from-indigo-500 to-blue-600"
  },
  {
    label: "Text Simplification",
    detail: "Improves readability for dyslexic users. Effect size d = 0.35. LLMs effective at simplifying text.",
    icon: "✨",
    accent: "from-cyan-500 to-blue-600"
  },
  {
    label: "Podcast Learning (Dyslexia)",
    detail: "Audio learning activates same brain regions as reading. Boosts comprehension and engagement.",
    icon: "🎧",
    accent: "from-violet-500 to-purple-600"
  },
  {
    label: "Audio Quizzes",
    detail: "Multisensory quiz (audio + visual) helps both ADHD and dyslexic learners stay engaged.",
    icon: "🔊",
    accent: "from-green-500 to-emerald-600"
  },
  {
    label: "Tech Interventions (ADHD)",
    detail: "Meta-analysis: Visual attention SMD -0.42, Executive function -0.35, Reaction time -0.43.",
    icon: "💻",
    accent: "from-amber-500 to-orange-600"
  },
  {
    label: "Assistive Tech (Dyslexia)",
    detail: "Improves phonological and visual processing. More access = better outcomes. Strong correlation.",
    icon: "🛠️",
    accent: "from-lime-500 to-green-600"
  },
  {
    label: "Eye-Tracking Precision",
    detail: "Used to differentiate ADHD from typical peers. Studies show 85%+ accuracy in tests.",
    icon: "🎯",
    accent: "from-red-500 to-pink-600"
  },
  {
    label: "VR-based ADHD Assessment",
    detail: "VR tools used for measuring attention profiles in clinical ADHD evaluations.",
    icon: "🥽",
    accent: "from-purple-500 to-indigo-600"
  },
  {
    label: "Text-to-Speech Benefits",
    detail: "Increases comprehension in dyslexic students. Also improves engagement and access equity.",
    icon: "🗣️",
    accent: "from-teal-500 to-cyan-600"
  },
  {
    label: "LLM Text Simplifiers",
    detail: "GPT-4 simplifies text to 7th-grade level effectively. Helps with decoding and understanding.",
    icon: "🤖",
    accent: "from-slate-500 to-gray-600"
  },
  {
    label: "Reading Comprehension Aids",
    detail: "Simplified vocabulary + spacing + line breaks make dense text manageable for dyslexic readers.",
    icon: "📖",
    accent: "from-sky-500 to-blue-600"
  },
  {
    label: "Self-esteem in Teens",
    detail: "Struggles with dyslexia/ADHD at 16+ often impact academic confidence and social perception.",
    icon: "💪",
    accent: "from-rose-500 to-pink-600"
  },
  {
    label: "Podcast vs Reading",
    detail: "Studies confirm semantic regions of brain light up equally in audio vs visual comprehension.",
    icon: "🧠",
    accent: "from-indigo-500 to-purple-600"
  },
  {
    label: "Multisensory Education",
    detail: "Audio + Visual learning outperforms single mode delivery for neurodivergent students.",
    icon: "🎨",
    accent: "from-orange-500 to-red-600"
  },
  {
    label: "Story-based Interventions",
    detail: "Narrative-style content improves ADHD focus more than quiz-only learning formats.",
    icon: "📝",
    accent: "from-emerald-500 to-green-600"
  },
  {
    label: "Digital Assessments",
    detail: "Interactive quizzes and tools for dyslexia rated highly for engagement and effectiveness.",
    icon: "📊",
    accent: "from-blue-500 to-indigo-600"
  },
];

export default function ModernCarouselStats({ isVisible = true }) {
  const [x, setX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef();
  const cardWidth = 340;
  const totalWidth = carouselItems.length * cardWidth;

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setX(prev => {
        const newX = prev - cardWidth;
        return newX <= -totalWidth ? 0 : newX;
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isPaused, totalWidth]);

  const duplicatedItems = [...carouselItems, ...carouselItems, ...carouselItems];

  return (
    <div className="w-full py-16">
      <div 
        className={`relative w-full transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex space-x-6"
          animate={{ x }}
          transition={{ 
            duration: isPaused ? 0 : 0.8,
            ease: "easeInOut"
          }}
        >
          {duplicatedItems.map((item, index) => (
            <motion.div
              key={`${item.label}-${index}`}
              className={`min-w-[${cardWidth}px] relative group cursor-pointer`}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                z: 50
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500 blur-xl`} />
              
              {/* Main card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-64 group-hover:border-white/30 transition-all duration-500 overflow-hidden">
                {/* Floating particles effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/40 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 3) * 20}%`,
                      }}
                      animate={{
                        y: [-10, -30, -10],
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                {/* Icon with pulse animation */}
                <motion.div 
                  className="text-4xl mb-4 flex justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {item.icon}
                </motion.div>

                {/* Title with gradient text */}
                <motion.h3 
                  className={`text-xl font-bold mb-4 text-center bg-gradient-to-r ${item.accent} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
                >
                  {item.label}
                </motion.h3>

                {/* Description with improved typography */}
                <motion.p 
                  className="text-gray-300 text-sm leading-relaxed text-center group-hover:text-white transition-colors duration-300"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {item.detail}
                </motion.p>

                {/* Subtle shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {carouselItems.slice(0, 5).map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full bg-white/20"
            animate={{
              scale: Math.floor(Math.abs(x) / cardWidth) % carouselItems.length === index ? 1.5 : 1,
              backgroundColor: Math.floor(Math.abs(x) / cardWidth) % carouselItems.length === index ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 text-white/60 text-sm"
        >
          Paused • Hover to explore
        </motion.div>
      )}
    </div>
  );
}