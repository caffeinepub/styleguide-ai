import { createContext, useContext, useState } from "react";
import type { StyleRecommendation } from "../backend.d.ts";

interface ResultContextType {
  result: StyleRecommendation | null;
  setResult: (r: StyleRecommendation | null) => void;
  capturedImage: string | null;
  setCapturedImage: (url: string | null) => void;
}

const ResultContext = createContext<ResultContextType | null>(null);

export function ResultProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<StyleRecommendation | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <ResultContext.Provider
      value={{ result, setResult, capturedImage, setCapturedImage }}
    >
      {children}
    </ResultContext.Provider>
  );
}

export function useResult() {
  const ctx = useContext(ResultContext);
  if (!ctx) throw new Error("useResult must be used within ResultProvider");
  return ctx;
}
