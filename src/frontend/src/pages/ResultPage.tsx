import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Footprints,
  Glasses,
  Scissors,
  Shirt,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useResult } from "../context/ResultContext";

// ── Face-shape tips ──────────────────────────────────────────────────────────

const GLASSES_TIPS: Record<string, string> = {
  oval: "Oval faces suit almost any frame — square and cat-eye styles maintain your natural balance.",
  round:
    "Angular frames add definition and make a round face appear longer and slimmer.",
  square: "Round and oval frames soften your strong jawline and sharp angles.",
  heart:
    "Aviator and rimless frames balance your wider forehead with your narrower chin.",
  diamond:
    "Cat-eye and oval frames highlight your eyes and soften prominent cheekbones.",
};

const HAIRSTYLE_TIPS: Record<string, string> = {
  oval: "Oval is the most versatile face shape — nearly all cuts and lengths work beautifully.",
  round:
    "Longer layers and height on top create the illusion of a slimmer, more elongated face.",
  square: "Soft curls and side-swept bangs gently break up the strong jawline.",
  heart:
    "Shoulder-length styles and chin bobs draw attention downward to balance a wide forehead.",
  diamond: "Textured waves and bangs reduce the width of prominent cheekbones.",
};

function getTip(
  tips: Record<string, string>,
  faceShape: string,
): string | null {
  const key = faceShape.toLowerCase().trim();
  return tips[key] ?? null;
}

// ── Color helpers ────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  white: "#f8f4f0",
  black: "#1a1410",
  gray: "#8a8480",
  grey: "#8a8480",
  beige: "#d4c5b0",
  cream: "#f0e8d8",
  ivory: "#f5f0e8",
  tan: "#c8a878",
  camel: "#c4955a",
  khaki: "#b8a878",
  taupe: "#a09080",
  brown: "#8b5e3c",
  chocolate: "#7b4a2c",
  navy: "#1e2e4a",
  "navy blue": "#1e2e4a",
  blue: "#3a6898",
  "sky blue": "#87b8d4",
  cobalt: "#1a4a8a",
  teal: "#2d8a7a",
  "light blue": "#a0c4d8",
  denim: "#4a6a8a",
  green: "#4a7a5a",
  olive: "#6b7a3a",
  sage: "#8a9878",
  emerald: "#2d7a5a",
  forest: "#2a5a3a",
  mint: "#88c8a8",
  red: "#b83030",
  burgundy: "#7a2a38",
  wine: "#6a2030",
  rose: "#d47880",
  blush: "#e8b0b8",
  coral: "#e07858",
  pink: "#e898a8",
  "dusty rose": "#c88898",
  mauve: "#b07880",
  purple: "#7a3a9a",
  lavender: "#c0a8d8",
  plum: "#6a3068",
  lilac: "#b898d0",
  violet: "#6048a8",
  yellow: "#d4b038",
  gold: "#c89838",
  mustard: "#b88828",
  orange: "#d87040",
  peach: "#e8a880",
  amber: "#c88a28",
  terracotta: "#b86048",
  rust: "#a05030",
  copper: "#b87040",
  sand: "#d0b888",
  linen: "#e8d8c0",
  charcoal: "#3a3430",
  slate: "#607080",
  "off-white": "#f0ece4",
  nude: "#d4b898",
  champagne: "#e8d4a8",
  "blush pink": "#e8b0b8",
  "warm white": "#f4ede0",
  "earth tones": "#a07848",
};

function getColorSwatch(colorName: string): string {
  const lower = colorName.toLowerCase().trim();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return "linear-gradient(135deg, #c8a878, #8a7868)";
}

// ── Static demo data ─────────────────────────────────────────────────────────

const DEMO_RESULT = {
  faceShape: "Oval",
  skinTone: "Warm Medium",
  glasses: ["Aviator frames", "Round tortoiseshell", "Cat-eye acetate"],
  hairstyles: ["Layered waves", "Side-swept bob", "Textured pixie cut"],
  clothingColors: [
    "Warm terracotta",
    "Olive green",
    "Champagne",
    "Deep burgundy",
  ],
  shoes: ["Ankle boots", "Block-heel mules", "Classic white sneakers"],
};

// ── Sub-components ───────────────────────────────────────────────────────────

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  delay?: number;
  tip?: string | null;
  children: React.ReactNode;
}

function ResultCard({
  icon,
  title,
  delay = 0,
  tip,
  children,
}: ResultCardProps) {
  return (
    <motion.div
      className="card-shimmer rounded-2xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "oklch(0.72 0.12 22 / 0.15)",
            border: "1px solid oklch(0.72 0.12 22 / 0.3)",
          }}
        >
          {icon}
        </div>
        <h3 className="font-display text-base font-medium text-foreground">
          {title}
        </h3>
      </div>

      {children}

      {tip && (
        <p
          className="mt-3 text-xs italic leading-relaxed"
          style={{ color: "oklch(0.52 0.025 55)" }}
        >
          {tip}
        </p>
      )}
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ResultPage() {
  const navigate = useNavigate();
  const { result, capturedImage, setResult, setCapturedImage } = useResult();

  const data = result ?? DEMO_RESULT;

  const glassesTip = getTip(GLASSES_TIPS, data.faceShape);
  const hairstyleTip = getTip(HAIRSTYLE_TIPS, data.faceShape);

  useEffect(() => {
    return () => {
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  const handleScanAgain = () => {
    setResult(null);
    setCapturedImage(null);
    navigate({ to: "/camera" });
  };

  const handleBack = () => {
    setResult(null);
    setCapturedImage(null);
    navigate({ to: "/" });
  };

  const skinToneColor = (tone: string) => {
    const t = tone.toLowerCase();
    if (t.includes("fair") || t.includes("light")) return "#f5d9c0";
    if (t.includes("warm") && t.includes("medium")) return "#d4a070";
    if (t.includes("medium")) return "#c09060";
    if (t.includes("olive")) return "#a87848";
    if (t.includes("dark") || t.includes("deep")) return "#7a5030";
    if (t.includes("warm")) return "#d4a070";
    if (t.includes("cool")) return "#c8a0b0";
    return "#c4987a";
  };

  return (
    <div
      data-ocid="result.page"
      className="min-h-screen bg-background flex flex-col max-w-[420px] mx-auto"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4 pt-12 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          type="button"
          data-ocid="result.secondary_button"
          onClick={handleBack}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: "oklch(0.16 0.014 28)",
            border: "1px solid oklch(0.28 0.015 28)",
          }}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <h2 className="font-display text-xl font-semibold text-foreground">
          Your Style Profile
        </h2>

        <div className="w-11" />
      </motion.div>

      {/* Captured image preview */}
      {capturedImage && (
        <motion.div
          className="px-4 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden"
            style={{ border: "2px solid oklch(0.72 0.12 22 / 0.5)" }}
          >
            <img
              src={capturedImage}
              alt="Your selfie"
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        </motion.div>
      )}

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-3">
        {/* Face Shape */}
        <ResultCard
          icon={
            <User
              className="w-4 h-4"
              style={{ color: "oklch(0.80 0.09 72)" }}
            />
          }
          title="Face Shape"
          delay={0.1}
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-3xl font-semibold text-gradient">
              {data.faceShape}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.72 0.12 22 / 0.2)" }}
            />
          </div>
        </ResultCard>

        {/* Skin Tone */}
        <ResultCard
          icon={
            <span className="text-sm" style={{ color: "oklch(0.80 0.09 72)" }}>
              ✦
            </span>
          }
          title="Skin Tone"
          delay={0.15}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex-shrink-0"
              style={{
                background: skinToneColor(data.skinTone),
                boxShadow: `0 2px 12px ${skinToneColor(data.skinTone)}60`,
                border: "1px solid oklch(0.28 0.015 28)",
              }}
            />
            <span className="font-display text-xl font-medium text-foreground">
              {data.skinTone}
            </span>
          </div>
        </ResultCard>

        {/* Glasses */}
        <ResultCard
          icon={
            <Glasses
              className="w-4 h-4"
              style={{ color: "oklch(0.80 0.09 72)" }}
            />
          }
          title="Recommended Glasses"
          delay={0.2}
          tip={glassesTip}
        >
          <div className="flex flex-wrap gap-2">
            {data.glasses.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-xl text-sm font-medium"
                style={{
                  background: "oklch(0.72 0.12 22 / 0.12)",
                  border: "1px solid oklch(0.72 0.12 22 / 0.25)",
                  color: "oklch(0.88 0.06 50)",
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </ResultCard>

        {/* Hairstyles */}
        <ResultCard
          icon={
            <Scissors
              className="w-4 h-4"
              style={{ color: "oklch(0.80 0.09 72)" }}
            />
          }
          title="Best Hairstyles"
          delay={0.25}
          tip={hairstyleTip}
        >
          <div className="space-y-2">
            {data.hairstyles.map((h) => (
              <div key={h} className="flex items-center gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "oklch(0.72 0.12 22)" }}
                />
                <span className="text-sm text-foreground">{h}</span>
              </div>
            ))}
          </div>
        </ResultCard>

        {/* Clothing Colors */}
        <ResultCard
          icon={
            <Shirt
              className="w-4 h-4"
              style={{ color: "oklch(0.80 0.09 72)" }}
            />
          }
          title="Clothing Color Palette"
          delay={0.3}
        >
          <div className="flex flex-wrap gap-3">
            {data.clothingColors.map((color) => {
              const swatch = getColorSwatch(color);
              return (
                <div key={color} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-12 h-12 rounded-xl"
                    style={{
                      background: swatch,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      border: "1px solid oklch(0.28 0.015 28)",
                    }}
                  />
                  <span
                    className="text-xs text-center leading-tight max-w-[56px]"
                    style={{ color: "oklch(0.65 0.02 60)" }}
                  >
                    {color}
                  </span>
                </div>
              );
            })}
          </div>
        </ResultCard>

        {/* Shoes */}
        <ResultCard
          icon={
            <Footprints
              className="w-4 h-4"
              style={{ color: "oklch(0.80 0.09 72)" }}
            />
          }
          title="Recommended Shoes"
          delay={0.35}
        >
          <div className="flex flex-wrap gap-2">
            {data.shoes.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-xl text-sm font-medium"
                style={{
                  background: "oklch(0.20 0.015 28)",
                  border: "1px solid oklch(0.32 0.015 28)",
                  color: "oklch(0.80 0.02 80)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </ResultCard>
      </div>

      {/* Sticky bottom button */}
      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-4 pb-8 pt-4"
        style={{
          background:
            "linear-gradient(to top, oklch(0.11 0.012 28) 70%, transparent)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        <button
          type="button"
          data-ocid="result.primary_button"
          onClick={handleScanAgain}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-base font-semibold tracking-wide transition-all active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.12 22), oklch(0.76 0.14 18))",
            color: "white",
            boxShadow:
              "0 6px 24px oklch(0.72 0.12 22 / 0.4), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Camera className="w-5 h-5" />
          Scan Again
        </button>
      </motion.div>
    </div>
  );
}
