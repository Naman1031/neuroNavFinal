import React, { useState, useEffect } from "react";
import {
  Brain,
  Focus,
  Timer,
  CheckCircle,
  Users,
  Zap,
  ArrowRight,
  Star,
  Sparkles,
  Heart,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "ADHD & Dyslexia Friendly",
      description:
        "Designed specifically for neurodivergent minds with accessible fonts and clear layouts",
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "from-emerald-400 to-teal-500",
      glowColor: "emerald-400/20",
    },
    {
      icon: <Timer className="w-6 h-6" />,
      title: "Personalized Focus Sessions",
      description:
        "Customizable time blocks based on your attention span and productivity patterns",
      gradient: "from-orange-500/10 to-red-500/10",
      iconBg: "from-orange-400 to-red-500",
      glowColor: "orange-400/20",
    },
    {
      icon: <Focus className="w-6 h-6" />,
      title: "Distraction Management",
      description:
        "Smart tools to identify and minimize distractions during your focus sessions",
      gradient: "from-violet-500/10 to-purple-500/10",
      iconBg: "from-violet-400 to-purple-500",
      glowColor: "violet-400/20",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Progress Tracking",
      description:
        "Visual progress indicators and achievements to keep you motivated",
      gradient: "from-rose-500/10 to-pink-500/10",
      iconBg: "from-rose-400 to-pink-500",
      glowColor: "rose-400/20",
    },
  ];

  const stats = [
    {
      number: "10k+",
      label: "Active Users",
      color: "from-emerald-400 to-teal-500",
    },
    {
      number: "89%",
      label: "Improved Focus",
      color: "from-orange-400 to-red-500",
    },
    {
      number: "4.8★",
      label: "User Rating",
      color: "from-yellow-400 to-orange-500",
    },
    {
      number: "24/7",
      label: "Support",
      color: "from-violet-400 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs with subtle movement */}
        <div
          className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl transition-transform duration-[20s] ease-in-out"
          style={{
            transform: `translate(${Math.sin(Date.now() / 10000) * 50}px, ${
              Math.cos(Date.now() / 8000) * 30
            }px)`,
            animation: "gentlePulse 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl transition-transform duration-[25s] ease-in-out"
          style={{
            transform: `translate(${Math.cos(Date.now() / 12000) * 40}px, ${
              Math.sin(Date.now() / 15000) * 50
            }px)`,
            animation: "gentlePulse 10s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-violet-500/20 to-purple-500/20 rounded-full blur-3xl transition-transform duration-[30s] ease-in-out"
          style={{
            transform: `translate(${Math.sin(Date.now() / 18000) * 60}px, ${
              Math.cos(Date.now() / 20000) * 40
            }px)`,
            animation: "gentlePulse 12s ease-in-out infinite 4s",
          }}
        />
      </div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => {
          const colors = [
            "emerald",
            "orange",
            "violet",
            "rose",
            "teal",
            "amber",
          ];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-${color}-400/40 rounded-full`}
              style={{
                left: `${10 + i * 8}%`,
                top: `${15 + ((i * 7) % 70)}%`,
                animation: `floatGentle ${8 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 1.2}s`,
              }}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <nav
        className={`relative z-10 p-6 backdrop-blur-sm bg-white/5 border-b border-white/10 transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Brain className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              NeuroNav
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-orange-300 transition-all duration-300 font-medium hover:scale-105 transform"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-emerald-300 transition-all duration-300 font-medium hover:scale-105 transform"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-violet-300 transition-all duration-300 font-medium hover:scale-105 transform"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-16">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1200 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-full px-4 py-2 mb-8 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-sm font-medium text-orange-200">
                Designed for neurodivergent minds
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Focus Better,
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Achieve More
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              The first productivity app designed specifically for ADHD and
              dyslexic minds. Transform your focus with personalized sessions
              and gentle guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/auth")}
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-110 active:scale-95 overflow-hidden"
              >
                <span className="flex items-center space-x-2 relative z-10">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              </button>

              <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 active:scale-95">
                <span className="group-hover:text-orange-200 transition-colors duration-300">
                  Watch Demo
                </span>
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 transition-all duration-1200 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-110 hover:-rotate-1">
                  <div
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:animate-pulse`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <section
            id="features"
            className={`mb-24 transition-all duration-1200 delay-600 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Built for Your Brain
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Every feature is carefully designed with neurodiversity in mind
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-6 rounded-2xl transition-all duration-700 cursor-pointer border overflow-hidden ${
                    activeFeature === index
                      ? `bg-gradient-to-br ${feature.gradient} border-white/30 shadow-2xl scale-105 shadow-${feature.glowColor}`
                      : "bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/10 hover:border-white/20 hover:scale-105"
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${
                      feature.iconBg
                    } mb-4 transition-all duration-500 shadow-lg ${
                      activeFeature === index
                        ? "scale-110 animate-pulse shadow-2xl"
                        : "group-hover:scale-110 group-hover:rotate-3"
                    }`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-gray-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Subtle glow effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${feature.iconBg} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
                  ></div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section
            className={`text-center py-16 mb-16 transition-all duration-1200 delay-800 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="relative bg-gradient-to-r from-slate-800/50 to-indigo-800/50 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-pulse"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Ready to Transform Your Focus?
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who have already improved their
                  productivity and focus
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button className="group relative px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-110 active:scale-95 overflow-hidden">
                    <span className="flex items-center space-x-2 relative z-10">
                      <span>Start Your Journey</span>
                      <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                  </button>

                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400 transition-all duration-300 hover:scale-125"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <span className="font-medium">Rated 4.8/5 by users</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4 group">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              NeuroNav
            </span>
          </div>
          <p className="text-gray-400">
            Empowering neurodivergent minds to achieve their full potential ✨
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes floatGentle {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.4;
          }
          33% {
            transform: translateY(-8px) translateX(4px) scale(1.1);
            opacity: 0.7;
          }
          66% {
            transform: translateY(4px) translateX(-3px) scale(0.9);
            opacity: 0.5;
          }
        }

        @keyframes gentlePulse {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
