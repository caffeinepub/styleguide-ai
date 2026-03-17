import { useNavigate } from "@tanstack/react-router";
import { Scan, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const DOT_POSITIONS = [
  "top-2 left-1/2",
  "bottom-2 left-1/2",
  "left-2 top-1/2",
  "right-2 top-1/2",
] as const;
const FEATURE_TAGS = [
  "Face Shape",
  "Skin Tone",
  "Glasses",
  "Hairstyle",
  "Colors",
  "Shoes",
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-between px-6 py-12 max-w-[420px] mx-auto">
      {/* Header area */}
      <motion.div
        className="flex flex-col items-center text-center mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.12 22), oklch(0.80 0.09 72))",
            boxShadow: "0 8px 32px oklch(0.72 0.12 22 / 0.4)",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="font-display text-4xl font-semibold text-foreground leading-tight mb-3">
          Style<span className="text-gradient">Guide</span>
          <br />
          <span className="italic">AI</span>
        </h1>

        <p className="text-muted-foreground text-base font-light max-w-[260px] leading-relaxed">
          Your personal stylist powered by AI — discover your unique look
        </p>
      </motion.div>

      {/* Center illustration */}
      <motion.div
        className="flex flex-col items-center gap-8 my-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative w-56 h-56">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid oklch(0.72 0.12 22 / 0.3)",
              boxShadow: "0 0 60px oklch(0.72 0.12 22 / 0.12) inset",
            }}
          />
          <div
            className="absolute inset-6 rounded-full"
            style={{ border: "1px dashed oklch(0.72 0.12 22 / 0.2)" }}
          />
          <div
            className="absolute inset-12 rounded-full flex items-center justify-center"
            style={{
              background: "oklch(0.72 0.12 22 / 0.08)",
              border: "1px solid oklch(0.72 0.12 22 / 0.25)",
            }}
          >
            <Scan
              className="w-10 h-10"
              style={{ color: "oklch(0.72 0.12 22)" }}
            />
          </div>
          {DOT_POSITIONS.map((pos) => (
            <motion.div
              key={pos}
              className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${pos}`}
              style={{ background: "oklch(0.72 0.12 22)" }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {FEATURE_TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: "oklch(0.72 0.12 22 / 0.12)",
                border: "1px solid oklch(0.72 0.12 22 / 0.25)",
                color: "oklch(0.82 0.08 50)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="w-full flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          type="button"
          data-ocid="home.primary_button"
          onClick={() => navigate({ to: "/camera" })}
          className="w-full h-16 rounded-2xl text-lg font-semibold tracking-wide transition-all duration-200 active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.12 22), oklch(0.76 0.14 18))",
            color: "white",
            boxShadow:
              "0 8px 32px oklch(0.72 0.12 22 / 0.45), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <span className="flex items-center justify-center gap-3">
            <Scan className="w-5 h-5" />
            Scan My Face
          </span>
        </button>

        <p className="text-muted-foreground text-xs text-center">
          Works with front camera — no photos stored
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="text-center mt-8">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
