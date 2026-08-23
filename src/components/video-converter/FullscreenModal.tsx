"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minimize2 } from "lucide-react";

interface FullscreenModalProps {
  svgCode: string;
  bgPattern: "dark" | "checker" | "light";
  setBgPattern: (pattern: "dark" | "checker" | "light") => void;
  onClose: () => void;
}

export default function FullscreenModal({
  svgCode,
  bgPattern,
  setBgPattern,
  onClose,
}: FullscreenModalProps) {
  // Listen for escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 text-white">
        <span className="text-sm font-semibold font-sans">Fullscreen SVG Preview</span>

        <div className="flex items-center gap-4">
          {/* Background pattern selectors in modal */}
          <div className="flex bg-white/10 rounded-[3px] p-0.5 border border-white/20">
            <button
              onClick={() => setBgPattern("dark")}
              className={`px-3 py-1 text-xs rounded-[3px] transition-all cursor-pointer ${
                bgPattern === "dark" ? "bg-[#5bb75b] text-white font-medium" : "text-white/70 hover:text-white"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBgPattern("checker")}
              className={`px-3 py-1 text-xs rounded-[3px] transition-all cursor-pointer ${
                bgPattern === "checker" ? "bg-[#5bb75b] text-white font-medium" : "text-white/70 hover:text-white"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setBgPattern("light")}
              className={`px-3 py-1 text-xs rounded-[3px] transition-all cursor-pointer ${
                bgPattern === "light" ? "bg-[#5bb75b] text-white font-medium" : "text-white/70 hover:text-white"
              }`}
            >
              Light
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/75 hover:text-white hover:bg-white/10 rounded-[3px] cursor-pointer"
            onClick={onClose}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Canvas rendering dynamic markup */}
      <div
        className={`flex-1 flex items-center justify-center p-6 relative overflow-hidden transition-all ${
          bgPattern === "checker"
            ? "bg-slate-950"
            : bgPattern === "light"
              ? "bg-slate-200"
              : "bg-black"
        }`}
        style={
          bgPattern === "checker"
            ? {
                backgroundImage: "radial-gradient(circle, #334155 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
              }
            : undefined
        }
      >
        <div
          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto [&>svg]:drop-shadow-2xl transition-all"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>

      {/* Esc hint footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-[4px] bg-slate-900/60 text-white/50 text-[10px] uppercase tracking-wider font-sans select-none pointer-events-none">
        Press <span className="text-white font-mono font-bold">Esc</span> to exit
      </div>
    </div>
  );
}
