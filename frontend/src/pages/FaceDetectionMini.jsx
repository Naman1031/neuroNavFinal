import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";
import "@lottiefiles/lottie-player";

const FaceDetectionMini = forwardRef(
  ({ setAttentionSpan, isDarkMode }, ref) => {
    const videoRef = useRef(null);
    const faceDetectorRef = useRef(null);
    const isRunningRef = useRef(false);
    const runningMode = useRef("IMAGE");
    const [nocameraaccess, setNocameraaccess] = useState(false);
    const [cameraPaused, setCamerapaused] = useState(false);

    useImperativeHandle(ref, () => ({
      startDetection,
      stopDetection,
    }));

    const startDetection = async () => {
      setNocameraaccess(false); // reset before typing
      setCamerapaused(false);

      try {
        if (!faceDetectorRef.current) {
          const vision = await FilesetResolver.forVisionTasks("/mediapipe");
          faceDetectorRef.current = await FaceDetector.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: "/models/blaze_face_short_range.tflite",
                delegate: "GPU",
              },
              runningMode: "IMAGE",
            }
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          isRunningRef.current = true;
          predictWebcam();
        }
      } catch (error) {
        console.log("Camera access denied!", error);
        setNocameraaccess(true);
      }
    };

    const stopDetection = () => {
      isRunningRef.current = false;
      setCamerapaused(true);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    };

    const predictWebcam = async () => {
      if (
        !isRunningRef.current ||
        !videoRef.current ||
        !faceDetectorRef.current
      )
        return;

      if (runningMode.current === "IMAGE") {
        await faceDetectorRef.current.setOptions({ runningMode: "VIDEO" });
        runningMode.current = "VIDEO";
      }

      const results = await faceDetectorRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );
      if (results.detections.length > 0) {
        const score = results.detections[0].categories[0].score;
        setAttentionSpan(Math.round(score * 100));
      }

      setTimeout(() => predictWebcam(), 500);
    };

    return (
      <div className="mt-4 flex justify-center items-center min-h-[240px]">
        {cameraPaused ? (
          <div className="text-center px-4 z-10">
            <lottie-player
              src="/animations/meditating_guru.json"
              background="transparent"
              speed="1"
              style={{ width: "200px", height: "200px", margin: "0 auto" }}
              loop
              autoplay
            ></lottie-player>
            <p className={isDarkMode ? "text-white mt-2" : "text-black mt-2"}>
              Focus mode is paused. Take a break if you want to 😎.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width={320}
            height={240}
          />
        )}
      </div>
    );
  }
);

export default FaceDetectionMini;
