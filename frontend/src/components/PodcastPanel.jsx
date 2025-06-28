import React, { useEffect, useRef } from "react";
import { Mic, Volume2 } from "lucide-react";

const PodcastPanel = ({
  cardClasses,
  isDarkMode,
  speed,
  volume,
  setSpeed,
  setVolume,
  podcastAudioUrl,
  scriptLines,
}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.playbackRate = speed;
    }
  }, [volume, speed, podcastAudioUrl]);

  const bgcolor = isDarkMode
    ? `p-5 mb-6 rounded-2xl text-sm shadow-md border transition-all
        bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900
        border-purple-700`
    : `bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100
        p-5 rounded-2xl text-sm mb-6 shadow-md border border-purple-300 transition-all`;

  return (
    <div
      className={`${cardClasses} rounded-2xl p-6 border shadow-xl backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">🎙️ Generate Podcast</h2>
      </div>

      {podcastAudioUrl && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">🎧 Your Podcast</h3>
          <audio
            ref={audioRef}
            controls
            className="w-full"
            onPlay={() => {
              if (audioRef.current) {
                audioRef.current.volume = volume / 100;
                audioRef.current.playbackRate = speed;
              }
            }}
          >
            <source src={podcastAudioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {scriptLines?.length > 0 && (
        <div className={bgcolor}>
          {scriptLines.map((line, idx) => (
            <p key={idx} className="mb-3 leading-relaxed">
              <strong
                className={
                  isDarkMode ? "text-purple-300" : "text-purple-800"
                }
              >
                {line.speaker}:
              </strong>{" "}
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                {line.text}
              </span>
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Speed: {speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Volume2 className="w-4 h-4 inline mr-1" />
            Volume: {volume}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div
        className={`mt-2 p-3 rounded-xl ${
          isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
        } text-sm`}
      >
        {podcastAudioUrl
          ? "✅ Podcast ready to play above!"
          : "📄 Add some content above to generate a podcast."}
      </div>
    </div>
  );
};

export default PodcastPanel;
