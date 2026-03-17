import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Circle, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useCamera } from "../camera/useCamera";
import { useResult } from "../context/ResultContext";
import { useActor } from "../hooks/useActor";

const CORNER_FRAMES = [
  { pos: "top-3 left-3", border: "border-t-2 border-l-2" },
  { pos: "top-3 right-3", border: "border-t-2 border-r-2" },
  { pos: "bottom-3 left-3", border: "border-b-2 border-l-2" },
  { pos: "bottom-3 right-3", border: "border-b-2 border-r-2" },
];

export default function CameraPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const { setResult, setCapturedImage } = useResult();

  const {
    videoRef,
    canvasRef,
    isActive,
    isLoading,
    error,
    isSupported,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    currentFacingMode,
  } = useCamera({ facingMode: "user", quality: 0.8, format: "image/jpeg" });

  // biome-ignore lint/correctness/useExhaustiveDependencies: start/stop only on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = useCallback(async () => {
    if (!isActive || !actor) {
      toast.error("Camera or backend not ready");
      return;
    }

    const file = await capturePhoto();
    if (!file) {
      toast.error("Failed to capture photo");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCapturedImage(previewUrl);

    const arrayBuffer = await file.arrayBuffer();
    const imageData = new Uint8Array(arrayBuffer);

    try {
      const recommendation = await actor.analyzeImage(imageData);
      setResult(recommendation);
      await stopCamera();
      navigate({ to: "/result" });
    } catch (err) {
      console.error(err);
      toast.error("Analysis failed. Please try again.");
      URL.revokeObjectURL(previewUrl);
      setCapturedImage(null);
    }
  }, [
    isActive,
    actor,
    capturePhoto,
    setCapturedImage,
    setResult,
    stopCamera,
    navigate,
  ]);

  const handleBack = useCallback(async () => {
    await stopCamera();
    navigate({ to: "/" });
  }, [stopCamera, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center max-w-[420px] mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-4 pt-12 pb-4 z-10">
        <button
          type="button"
          data-ocid="camera.cancel_button"
          onClick={handleBack}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: "oklch(0.16 0.014 28 / 0.8)",
            border: "1px solid oklch(0.28 0.015 28)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <h2 className="font-display text-lg font-medium text-foreground">
          Take a Selfie
        </h2>

        <button
          type="button"
          onClick={() => switchCamera()}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: "oklch(0.16 0.014 28 / 0.8)",
            border: "1px solid oklch(0.28 0.015 28)",
            backdropFilter: "blur(8px)",
          }}
          title={`Switch to ${currentFacingMode === "user" ? "back" : "front"} camera`}
        >
          <RotateCcw className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Camera viewport */}
      <div className="relative w-full flex-1 flex items-center justify-center px-4">
        <div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{
            aspectRatio: "3/4",
            background: "oklch(0.08 0.01 28)",
            border: "1px solid oklch(0.28 0.015 28)",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: currentFacingMode === "user" ? "scaleX(-1)" : "none",
            }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Face guide oval */}
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-48 h-64 rounded-full"
                style={{
                  border: "2px solid oklch(0.72 0.12 22 / 0.6)",
                  boxShadow: "0 0 0 9999px oklch(0 0 0 / 0.25)",
                }}
              />
            </div>
          )}

          {/* Corner frames */}
          {isActive &&
            CORNER_FRAMES.map(({ pos, border }) => (
              <div
                key={pos}
                className={`absolute ${pos} w-6 h-6 ${border} rounded-sm`}
                style={{ borderColor: "oklch(0.72 0.12 22)" }}
              />
            ))}

          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                data-ocid="camera.loading_state"
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{
                  background: "oklch(0.08 0.01 28 / 0.85)",
                  backdropFilter: "blur(4px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
                  style={{
                    borderColor: "oklch(0.72 0.12 22)",
                    borderTopColor: "transparent",
                  }}
                />
                <p className="text-foreground text-sm font-medium">
                  Analyzing your face…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8"
                style={{ background: "oklch(0.08 0.01 28 / 0.9)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle
                  className="w-12 h-12"
                  style={{ color: "oklch(0.72 0.12 22)" }}
                />
                <p className="text-foreground text-center text-sm">
                  {error.message}
                </p>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
                  style={{
                    background: "oklch(0.72 0.12 22 / 0.2)",
                    border: "1px solid oklch(0.72 0.12 22 / 0.4)",
                    color: "oklch(0.85 0.08 50)",
                  }}
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Not supported */}
          {isSupported === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8">
              <AlertCircle
                className="w-12 h-12"
                style={{ color: "oklch(0.72 0.12 22)" }}
              />
              <p className="text-foreground text-center text-sm">
                Camera not supported on this device
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Capture button */}
      <div className="w-full flex items-center justify-center pb-12 pt-6">
        <motion.button
          type="button"
          data-ocid="camera.button"
          onClick={handleCapture}
          disabled={!isActive || isLoading}
          className="relative flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          whileTap={{ scale: 0.93 }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ border: "3px solid oklch(0.72 0.12 22 / 0.6)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.12 22), oklch(0.78 0.14 18))",
                boxShadow: "0 4px 24px oklch(0.72 0.12 22 / 0.5)",
              }}
            >
              <Circle className="w-6 h-6 fill-white text-white" />
            </div>
          </div>
        </motion.button>
      </div>

      <p className="text-muted-foreground text-xs text-center pb-6 px-6">
        Position your face within the oval and tap to capture
      </p>
    </div>
  );
}
