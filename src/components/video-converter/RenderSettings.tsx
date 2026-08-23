"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sliders } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RenderSettingsProps {
  resolution: string;
  setResolution: (val: string) => void;
  fps: string;
  setFps: (val: string) => void;
  codec: "h264" | "vp9" | "prores";
  setCodec: (val: "h264" | "vp9" | "prores") => void;
  duration: string;
  setDuration: (val: string) => void;
}

export default function RenderSettings({
  resolution,
  setResolution,
  fps,
  setFps,
  codec,
  setCodec,
  duration,
  setDuration,
}: RenderSettingsProps) {
  return (
    <div className="rounded-[4px] border border-[#ced4da] bg-white p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-[#ced4da] pb-3">
        <Sliders className="h-4 w-4 text-[#5bb75b]" />
        <h2 className="text-sm font-semibold text-[#2e2e2e] font-sans">Export Specifications</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Resolution */}
        <div className="space-y-1.5">
          <Label className="text-xs text-[#6c757d] font-sans">Resolution</Label>
          <Select value={resolution} onValueChange={(val) => val && setResolution(val)}>
            <SelectTrigger className="w-full h-10 px-3 bg-white border-[#ced4da] text-[#2e2e2e] text-sm rounded-[4px] hover:border-[#5bb75b] focus:ring-1 focus:ring-[#5bb75b] focus-visible:border-[#5bb75b]">
              <SelectValue placeholder="Resolution" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#ced4da] text-[#2e2e2e]">
              <SelectItem value="3840x2160">4K Ultra HD (3840x2160) - Best</SelectItem>
              <SelectItem value="1920x1080">Full HD 1080p (1920x1080)</SelectItem>
              <SelectItem value="1280x720">HD 720p (1280x720)</SelectItem>
              <SelectItem value="1080x1080">1:1 Square (1080x1080)</SelectItem>
              <SelectItem value="1080x1920">9:16 Vertical Story (1080x1920)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Frame Rate */}
        <div className="space-y-1.5">
          <Label className="text-xs text-[#6c757d] font-sans">Frame Rate</Label>
          <Select value={fps} onValueChange={(val) => val && setFps(val)}>
            <SelectTrigger className="w-full h-10 px-3 bg-white border-[#ced4da] text-[#2e2e2e] text-sm rounded-[4px] hover:border-[#5bb75b] focus:ring-1 focus:ring-[#5bb75b] focus-visible:border-[#5bb75b]">
              <SelectValue placeholder="FPS" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#ced4da] text-[#2e2e2e]">
              <SelectItem value="24">24 FPS (Cinematic)</SelectItem>
              <SelectItem value="30">30 FPS (Standard Video)</SelectItem>
              <SelectItem value="60">60 FPS (Ultra Smooth)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video Codec */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs text-[#6c757d] font-sans">Video Codec</Label>
          <Select value={codec} onValueChange={(val) => val && setCodec(val as any)}>
            <SelectTrigger className="w-full h-10 px-3 bg-white border-[#ced4da] text-[#2e2e2e] text-sm rounded-[4px] hover:border-[#5bb75b] focus:ring-1 focus:ring-[#5bb75b] focus-visible:border-[#5bb75b]">
              <SelectValue placeholder="Codec" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#ced4da] text-[#2e2e2e]">
              <SelectItem value="h264">H.264 (MP4) - Standard (Recommended)</SelectItem>
              <SelectItem value="vp9">VP9 (MP4) - Compatibility Fallback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Duration Slider */}
        <div className="sm:col-span-2 space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-[#6c757d]">
            <span className="font-sans">
              Duration: <strong className="text-[#2e2e2e] text-sm font-semibold">{duration}s</strong>
            </span>
            <div className="flex gap-1">
              {[5, 10, 15, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setDuration(sec.toString())}
                  className={`px-2 py-0.5 rounded-[3px] text-[11px] border transition-colors cursor-pointer ${
                    duration === sec.toString()
                      ? "bg-[#5bb75b] border-[#5bb75b] text-white font-medium shadow-sm"
                      : "bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex-1 accent-[#5bb75b] cursor-pointer bg-slate-200 h-1.5 rounded-lg appearance-none"
            />
            <Input
              type="number"
              min="5"
              max="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-16 h-8 text-xs bg-white border-[#ced4da] text-center text-[#2e2e2e] rounded-[3px] focus:border-[#5bb75b] focus:ring-[#5bb75b]"
            />
          </div>
          <p className="text-[11px] text-[#6c757d] font-sans">
            Adobe Stock / Shutterstock standard length requirement: 5s – 60s.
          </p>
        </div>
      </div>
    </div>
  );
}
