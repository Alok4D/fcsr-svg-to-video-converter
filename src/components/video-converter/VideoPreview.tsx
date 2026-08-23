"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Maximize2 } from "lucide-react";

interface VideoPreviewProps {
  svgCode: string;
  bgPattern: "dark" | "checker" | "light";
  setBgPattern: (pattern: "dark" | "checker" | "light") => void;
  previewKey: number;
  onRestartPreview: () => void;
  onFullscreenTrigger: () => void;
}

export default function VideoPreview({
  svgCode,
  bgPattern,
  setBgPattern,
  previewKey,
  onRestartPreview,
  onFullscreenTrigger,
}: VideoPreviewProps) {
  return (
    <div className="rounded-[4px] border border-[#ced4da] bg-white overflow-hidden shadow-sm flex flex-col">
      {/* Live Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#ced4da] bg-[#f8f9fa]">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-[#5bb75b]" />
          <span className="text-sm font-semibold text-[#2e2e2e] font-sans">Live Preview</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Background Pattern Switcher */}
          <div className="flex bg-slate-100 rounded-[3px] p-0.5 border border-[#ced4da]">
            <button
              onClick={() => setBgPattern("dark")}
              className={`px-2 py-0.5 text-[11px] rounded-[3px] transition-all cursor-pointer ${
                bgPattern === "dark"
                  ? "bg-[#5bb75b] text-white font-medium shadow-sm"
                  : "text-slate-500 hover:text-[#2e2e2e]"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBgPattern("checker")}
              className={`px-2 py-0.5 text-[11px] rounded-[3px] transition-all cursor-pointer ${
                bgPattern === "checker"
                  ? "bg-[#5bb75b] text-white font-medium shadow-sm"
                  : "text-slate-500 hover:text-[#2e2e2e]"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setBgPattern("light")}
              className={`px-2 py-0.5 text-[11px] rounded-[3px] transition-all cursor-pointer ${
                bgPattern === "light"
                  ? "bg-[#5bb75b] text-white font-medium shadow-sm"
                  : "text-slate-500 hover:text-[#2e2e2e]"
              }`}
            >
              Light
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#6c757d] hover:text-[#2e2e2e] hover:bg-slate-200 rounded-[3px] cursor-pointer"
            onClick={onRestartPreview}
            title="Restart Preview Animation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#6c757d] hover:text-[#2e2e2e] hover:bg-slate-200 rounded-[3px] cursor-pointer"
            onClick={onFullscreenTrigger}
            title="Fullscreen Preview"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div
        className={`h-[280px] p-4 flex items-center justify-center relative overflow-hidden transition-all ${
          bgPattern === "checker"
            ? "bg-slate-900"
            : bgPattern === "light"
              ? "bg-slate-200"
              : "bg-black"
        }`}
        style={
          bgPattern === "checker"
            ? {
                backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }
            : undefined
        }
      >
        <div
          key={previewKey}
          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto transition-all"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>
    </div>
  );
}
