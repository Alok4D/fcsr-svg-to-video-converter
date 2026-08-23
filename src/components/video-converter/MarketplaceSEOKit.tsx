"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

interface VideoDetails {
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  fileSize?: string;
  codec?: "h264" | "vp9" | "prores";
}

interface MarketplaceSEOKitProps {
  metadataTitle: string;
  setMetadataTitle: (val: string) => void;
  metadataKeywords: string;
  setMetadataKeywords: (val: string) => void;
  isGeneratingMetadata: boolean;
  onGenerateAIMetadata: () => void;
  videoDetails: VideoDetails | null;
}

export default function MarketplaceSEOKit({
  metadataTitle,
  setMetadataTitle,
  metadataKeywords,
  setMetadataKeywords,
  isGeneratingMetadata,
  onGenerateAIMetadata,
  videoDetails,
}: MarketplaceSEOKitProps) {
  const keywordCount = metadataKeywords.split(",").filter(Boolean).length;

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(metadataTitle);
    toast.success("Copied title to clipboard!");
  };

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(metadataKeywords);
    toast.success("Copied keywords to clipboard!");
  };

  const handleExportTXT = () => {
    const txtContent = `TITLE:\n${metadataTitle}\n\nKEYWORDS:\n${metadataKeywords}`;
    const encodedUri = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "metadata.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded TXT metadata file!");
  };

  const handleExportCSV = () => {
    const filename = videoDetails?.codec === "prores" ? "stock-video-prores.mov" : "stock-video.mp4";
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Filename", "Title", "Keywords", "Category"].join(",") +
      "\n" +
      [
        filename,
        `"${metadataTitle.replace(/"/g, '""')}"`,
        `"${metadataKeywords.replace(/"/g, '""')}"`,
        "Abstract",
      ].join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marketplace-metadata.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded CSV metadata spreadsheet!");
  };

  const hasMetadata = !!metadataTitle || !!metadataKeywords || isGeneratingMetadata;

  return (
    <div className="rounded-[4px] border border-[#ced4da] bg-white p-5 shadow-sm flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between border-b border-[#ced4da] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#5bb75b]" />
          <h2 className="text-sm font-semibold text-[#2e2e2e] font-sans">Marketplace SEO Kit</h2>
        </div>
        {hasMetadata && (
          <Button
            onClick={onGenerateAIMetadata}
            disabled={isGeneratingMetadata}
            size="sm"
            className="bg-[#5bb75b] hover:bg-[#449d44] text-white text-xs font-semibold rounded-[4px] h-8 px-3 transition-all active:scale-95 border-0 shadow-sm cursor-pointer"
          >
            {isGeneratingMetadata ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1.5" />
                Re-Generate with AI
              </>
            )}
          </Button>
        )}
      </div>

      {!hasMetadata ? (
        <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
          <Sparkles className="h-8 w-8 text-[#5bb75b] animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-[#2e2e2e] font-sans uppercase tracking-wider">AI-Generated Marketplace SEO Kit</h3>
            <p className="text-[11px] text-[#6c757d] max-w-sm font-sans leading-relaxed">
              Generate metadata (optimized titles and tags) for uploading your video to stock marketplaces like Adobe Stock, Shutterstock, and Pond5.
            </p>
          </div>
          <Button
            onClick={onGenerateAIMetadata}
            disabled={isGeneratingMetadata}
            className="bg-[#5bb75b] hover:bg-[#449d44] text-white text-xs font-semibold rounded-[4px] h-9 px-4 transition-all active:scale-95 border-0 shadow-sm cursor-pointer mt-1"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Generate SEO Metadata
          </Button>
        </div>
      ) : (
        <>
          {/* Title Generator Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-[#6c757d] font-sans">Stock Video Title</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] text-[#6c757d] hover:text-[#2e2e2e] p-1 gap-1 cursor-pointer"
                onClick={handleCopyTitle}
                disabled={isGeneratingMetadata}
              >
                <Copy className="h-3 w-3" />
                Copy Title
              </Button>
            </div>
            {isGeneratingMetadata ? (
              <div className="w-full h-10 bg-slate-100 rounded-[4px] border border-[#ced4da] flex items-center px-3 animate-pulse">
                <div className="h-3 w-[70%] bg-slate-200 rounded-[3px]" />
              </div>
            ) : (
              <Input
                value={metadataTitle}
                onChange={(e) => setMetadataTitle(e.target.value)}
                className="w-full h-10 px-3 bg-[#f8f9fa] border-[#ced4da] text-[#2e2e2e] text-sm font-sans rounded-[4px]"
                placeholder="Generating title..."
              />
            )}
          </div>

          {/* Keywords Tag Cloud Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-[#6c757d] font-sans">
                Search Tags / Keywords ({keywordCount})
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] text-[#6c757d] hover:text-[#2e2e2e] p-1 gap-1 cursor-pointer"
                onClick={handleCopyKeywords}
                disabled={isGeneratingMetadata}
              >
                <Copy className="h-3 w-3" />
                Copy Tags
              </Button>
            </div>

            {isGeneratingMetadata ? (
              <div className="flex flex-wrap gap-1.5 p-3 bg-[#f8f9fa] border border-[#ced4da] rounded-[4px] min-h-[120px] max-h-[160px] overflow-hidden w-full items-start content-start animate-pulse">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-6 bg-slate-200 rounded-[3px]" 
                    style={{ width: `${45 + (i % 6) * 12}px` }} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-[#f8f9fa] border border-[#ced4da] rounded-[4px] max-h-[180px] overflow-y-auto w-full">
                {metadataKeywords.split(",").filter(Boolean).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-xs px-2.5 py-1 rounded-[4px] bg-white border border-[#ced4da] text-slate-700 font-sans shadow-sm hover:border-[#5bb75b] transition-all cursor-default"
                  >
                    {tag.trim()}
                  </span>
                ))}
                {keywordCount === 0 && (
                  <span className="text-xs text-[#6c757d] italic font-sans">
                    No tags generated yet.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* CSV/TXT Export Options */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-[4px] mt-1.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-[#2e2e2e] font-sans">
                Bulk Metadata CSV Export
              </span>
              <span className="text-[9px] text-[#6c757d] font-sans font-normal">
                Perfect for uploading multiple files to stock agency dashboards.
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-[#ced4da] bg-white hover:bg-slate-50 text-[#2e2e2e] rounded-[4px] shadow-sm font-semibold transition-all active:scale-95 cursor-pointer"
                onClick={handleExportTXT}
                disabled={isGeneratingMetadata}
              >
                Export TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-[#ced4da] bg-white hover:bg-slate-50 text-[#2e2e2e] rounded-[4px] shadow-sm font-semibold transition-all active:scale-95 cursor-pointer"
                onClick={handleExportCSV}
                disabled={isGeneratingMetadata}
              >
                Export CSV
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
