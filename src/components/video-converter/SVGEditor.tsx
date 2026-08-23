"use client";

import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Code2, UploadCloud, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Preset {
  name: string;
  code: string;
}

interface SVGEditorProps {
  svgCode: string;
  onChange: (value: string) => void;
  presets: Preset[];
  activePresetName: string;
  onPresetChange: (name: string) => void;
  copied: boolean;
  onCopyCode: () => void;
  onUploadSVG: (code: string) => void;
}

export default function SVGEditor({
  svgCode,
  onChange,
  presets,
  activePresetName,
  onPresetChange,
  copied,
  onCopyCode,
  onUploadSVG,
}: SVGEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUploadSVG(event.target.result as string);
        toast.success("Uploaded SVG file successfully!");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col gap-4 w-full h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-[4px] border border-[#ced4da] shadow-sm">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-[#5bb75b]" />
          <span className="text-sm font-semibold text-[#2e2e2e] font-sans">SVG Code Editor</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Presets dropdown */}
          <Select
            value={activePresetName !== "Custom SVG" ? activePresetName : undefined}
            onValueChange={(val) => {
              if (val) onPresetChange(val);
            }}
          >
            <SelectTrigger className="h-10 px-3 text-sm bg-white border-[#ced4da] w-[170px] text-[#2e2e2e] rounded-[4px] hover:border-[#5bb75b] focus:ring-1 focus:ring-[#5bb75b]">
              <SelectValue placeholder="✨ Load Preset" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#ced4da] text-[#2e2e2e]">
              {presets.map((preset) => (
                <SelectItem
                  key={preset.name}
                  value={preset.name}
                  className="text-xs focus:bg-[#f8f9fa] focus:text-[#5bb75b]"
                >
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Import / Upload SVG */}
          <input
            type="file"
            id="svg-upload-input"
            ref={fileInputRef}
            accept=".svg"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-white border-[#ced4da] hover:bg-[#f8f9fa] hover:text-[#2e2e2e] text-[#2e2e2e] rounded-[4px] transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-3.5 w-3.5 mr-1 text-[#6c757d]" />
            Upload .SVG
          </Button>

          {/* Copy Code */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-[#6c757d] hover:text-[#2e2e2e] hover:bg-slate-100 rounded-[3px]"
            onClick={onCopyCode}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-[500px] rounded-[4px] border border-[#ced4da] overflow-hidden shadow-sm bg-[#1e1e1e] flex flex-col hover:shadow-1 transition-all">
        <Editor
          height="100%"
          defaultLanguage="xml"
          theme="vs-dark"
          value={svgCode}
          onChange={(val) => onChange(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: "on",
            formatOnPaste: true,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
