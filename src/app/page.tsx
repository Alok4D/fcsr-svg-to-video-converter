"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Film, Loader2, CheckCircle2, AlertCircle, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import modular components
import SVGEditor from "@/components/video-converter/SVGEditor";
import VideoPreview from "@/components/video-converter/VideoPreview";
import RenderSettings from "@/components/video-converter/RenderSettings";
import MarketplaceSEOKit from "@/components/video-converter/MarketplaceSEOKit";
import FullscreenModal from "@/components/video-converter/FullscreenModal";
import { clientRenderVideo } from "@/lib/video/client-render";

const SVG_PRESETS = [
  {
    name: "Glowing Neon Pulse",
    code: `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2160" preserveAspectRatio="xMidYMid meet" class="viz-svg-overlay" style="width: 100%; height: 100%; background-color: rgb(45, 222, 3); display: block; --speed: 1.2s;"><defs><filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><style>
        @keyframes spinner-fade {
            0% { opacity: 1; }
            100% { opacity: 0.15; }
        }
        @keyframes spinner-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .segment {
            animation: spinner-fade 1.2s linear infinite;
            fill: #FFFFFF;
        }
        .spinner-group {
            transform-origin: 1920px 1080px;
            animation: spinner-rotate calc(1.2s * 4) linear infinite;
        }
    </style><g class="spinner-group" filter="url(#glow-filter)"><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(0, 1920, 1080)" style="animation-delay: 0s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(30, 1920, 1080)" style="animation-delay: 0.1s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(60, 1920, 1080)" style="animation-delay: 0.2s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(90, 1920, 1080)" style="animation-delay: 0.3s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(120, 1920, 1080)" style="animation-delay: 0.4s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(150, 1920, 1080)" style="animation-delay: 0.5s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(180, 1920, 1080)" style="animation-delay: 0.6s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(210, 1920, 1080)" style="animation-delay: 0.7s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(240, 1920, 1080)" style="animation-delay: 0.8s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(270, 1920, 1080)" style="animation-delay: 0.9s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(300, 1920, 1080)" style="animation-delay: 1s;"/><rect class="segment" x="1875" y="450" width="90" height="280" rx="45" transform="rotate(330, 1920, 1080)" style="animation-delay: 1.1s;"/></g></svg>`,
  },
  {
    name: "Stock Cyber Portal",
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Cyan Neon Glow -->
    <filter id="neon-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur1" />
      <feGaussianBlur stdDeviation="15" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    
    <!-- Magenta Neon Glow -->
    <filter id="neon-glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur1" />
      <feGaussianBlur stdDeviation="20" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    
    <!-- Core Glow -->
    <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="30%" stop-color="#ff007f" stop-opacity="0.8" />
      <stop offset="70%" stop-color="#00f3ff" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    
    <!-- Grid Overlay -->
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1f1f2e" stroke-width="1.5" />
    </pattern>
  </defs>

  <!-- Deep Sci-Fi Background -->
  <rect width="100%" height="100%" fill="#0a0a12" />
  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.4" />
  
  <!-- Cyber Portal Core Container -->
  <g transform="translate(960, 540)">
    
    <!-- Background Portal Glow -->
    <circle r="400" fill="none" stroke="#ff007f" stroke-dasharray="2, 8" stroke-width="1" opacity="0.3">
      <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="40s" repeatCount="indefinite" />
    </circle>
    
    <!-- 1. Outer Tech Ring (Teal, Dashed, Fast Rotation) -->
    <circle r="360" fill="none" stroke="#00f3ff" stroke-width="3" stroke-dasharray="10 30 180 30" opacity="0.8" filter="url(#neon-glow-cyan)">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="16s" repeatCount="indefinite" />
    </circle>
    
    <!-- 2. Middle Tech Ring (Magenta, Dotted Radar) -->
    <circle r="300" fill="none" stroke="#ff007f" stroke-width="2" stroke-dasharray="4 16" opacity="0.7" filter="url(#neon-glow-magenta)">
      <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="25s" repeatCount="indefinite" />
    </circle>
    
    <!-- 3. Outer Hexagon (Rotating Teal) -->
    <polygon points="0,-250 216,-125 216,125 0,250 -216,125 -216,-125" fill="none" stroke="#00f3ff" stroke-width="4" opacity="0.9" filter="url(#neon-glow-cyan)">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="12s" repeatCount="indefinite" />
    </polygon>
    
    <!-- 4. Inner Hexagon (Opposite Rotating Magenta) -->
    <polygon points="0,-190 164,-95 164,95 0,190 -164,95 -164,-95" fill="none" stroke="#ff007f" stroke-width="3" opacity="0.75" filter="url(#neon-glow-magenta)">
      <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="8s" repeatCount="indefinite" />
    </polygon>
    
    <!-- 5. Crosshair Elements -->
    <g stroke="#00f3ff" stroke-width="1.5" opacity="0.6">
      <line x1="-390" y1="0" x2="-330" y2="0" />
      <line x1="330" y1="0" x2="390" y2="0" />
      <line x1="0" y1="-390" x2="0" y2="-330" />
      <line x1="0" y1="330" x2="0" y2="390" />
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="30s" repeatCount="indefinite" />
    </g>
    
    <!-- 6. Dotted Portal Nodes (Spinning Orbitals) -->
    <g>
      <circle cx="0" cy="-300" r="8" fill="#00f3ff" filter="url(#neon-glow-cyan)" />
      <circle cx="0" cy="300" r="8" fill="#00f3ff" filter="url(#neon-glow-cyan)" />
      <circle cx="-259.8" cy="-150" r="6" fill="#ff007f" filter="url(#neon-glow-magenta)" />
      <circle cx="259.8" cy="150" r="6" fill="#ff007f" filter="url(#neon-glow-magenta)" />
      <circle cx="259.8" cy="-150" r="6" fill="#ff007f" filter="url(#neon-glow-magenta)" />
      <circle cx="-259.8" cy="150" r="6" fill="#ff007f" filter="url(#neon-glow-magenta)" />
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite" />
    </g>
    
    <!-- 7. Portal Core (Pulsing Light Source) -->
    <circle r="90" fill="url(#core-grad)">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle r="50" fill="#ffffff" filter="url(#neon-glow-cyan)">
      <animate attributeName="r" values="40;55;40" dur="2s" repeatCount="indefinite" />
    </circle>
    
  </g>
</svg>`,
  },
  {
    name: "Modern Floating Waves",
    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Rich Gradients for Purple-Blue Waves -->
    <linearGradient id="grad-purple-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4e54c8" />
      <stop offset="50%" stop-color="#8f94fb" />
      <stop offset="100%" stop-color="#00f3ff" />
    </linearGradient>
    <linearGradient id="grad-purple-2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3f2b96" />
      <stop offset="100%" stop-color="#a8c0ff" />
    </linearGradient>

    <!-- Rich Gradients for Magenta-Pink Waves -->
    <linearGradient id="grad-magenta-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fc00ff" />
      <stop offset="100%" stop-color="#00dbde" />
    </linearGradient>
    <linearGradient id="grad-magenta-2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff007f" />
      <stop offset="50%" stop-color="#7900ff" />
      <stop offset="100%" stop-color="#110724" />
    </linearGradient>

    <!-- Luminous Neon Line Gradients -->
    <linearGradient id="grad-line-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.1" />
      <stop offset="50%" stop-color="#00f3ff" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#ff007f" stop-opacity="0.1" />
    </linearGradient>
    
    <linearGradient id="grad-line-magenta" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff007f" stop-opacity="0.1" />
      <stop offset="50%" stop-color="#ff007f" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#00f3ff" stop-opacity="0.1" />
    </linearGradient>

    <!-- Ambient Backlight Glowing Centers -->
    <radialGradient id="ambient-cyan" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#05050e" stop-opacity="0" />
    </radialGradient>
    
    <radialGradient id="ambient-magenta" cx="80%" cy="70%" r="60%">
      <stop offset="0%" stop-color="#ff007f" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#05050e" stop-opacity="0" />
    </radialGradient>
    
    <radialGradient id="bg-radial" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#140a2b" />
      <stop offset="100%" stop-color="#040409" />
    </radialGradient>

    <!-- Drop Shadows -->
    <filter id="shadow-deep" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="-12" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.75" />
    </filter>
  </defs>

  <!-- Deep Dark Luminous Space Background -->
  <rect width="100%" height="100%" fill="url(#bg-radial)" />
  <rect width="100%" height="100%" fill="url(#ambient-cyan)" />
  <rect width="100%" height="100%" fill="url(#ambient-magenta)" />

  <!-- A. Tech Dots Matrix (Visible and Pulsing beautifully) -->
  <g fill="#ffffff" opacity="0.35" filter="url(#shadow-deep)">
    <!-- Top-Left Grid -->
    <g transform="translate(100, 120)">
      <circle cx="0" cy="0" r="3.5" /><circle cx="40" cy="0" r="3.5" /><circle cx="80" cy="0" r="3.5" /><circle cx="120" cy="0" r="3.5" /><circle cx="160" cy="0" r="3.5" /><circle cx="200" cy="0" r="3.5" />
      <circle cx="0" cy="30" r="3.5" /><circle cx="40" cy="30" r="3.5" /><circle cx="80" cy="30" r="3.5" /><circle cx="120" cy="30" r="3.5" /><circle cx="160" cy="30" r="3.5" /><circle cx="200" cy="30" r="3.5" />
      <circle cx="0" cy="60" r="3.5" /><circle cx="40" cy="60" r="3.5" /><circle cx="80" cy="60" r="3.5" /><circle cx="120" cy="60" r="3.5" /><circle cx="160" cy="60" r="3.5" /><circle cx="200" cy="60" r="3.5" />
      <animate attributeName="opacity" values="0.25;0.65;0.25" dur="5s" repeatCount="indefinite" />
    </g>
    
    <!-- Bottom-Right Grid -->
    <g transform="translate(1620, 880)">
      <circle cx="0" cy="0" r="3.5" /><circle cx="40" cy="0" r="3.5" /><circle cx="80" cy="0" r="3.5" /><circle cx="120" cy="0" r="3.5" /><circle cx="160" cy="0" r="3.5" /><circle cx="200" cy="0" r="3.5" />
      <circle cx="0" cy="30" r="3.5" /><circle cx="40" cy="30" r="3.5" /><circle cx="80" cy="30" r="3.5" /><circle cx="120" cy="30" r="3.5" /><circle cx="160" cy="30" r="3.5" /><circle cx="200" cy="30" r="3.5" />
      <circle cx="0" cy="60" r="3.5" /><circle cx="40" cy="60" r="3.5" /><circle cx="80" cy="60" r="3.5" /><circle cx="120" cy="60" r="3.5" /><circle cx="160" cy="60" r="3.5" /><circle cx="200" cy="60" r="3.5" />
      <animate attributeName="opacity" values="0.65;0.25;0.65" dur="5s" repeatCount="indefinite" />
    </g>
  </g>

  <!-- B. Glowing Topological Wave Contours (Beautiful cyan & magenta neon lines) -->
  <g fill="none" stroke-width="1.5">
    <!-- Top-to-Bottom Cyber Stream (Cyan) -->
    <path stroke="url(#grad-line-cyan)">
      <animate attributeName="d" values="
        M-50,220 C400,380 700,200 1000,120 C1200,50 1400,80 1700,180;
        M-50,270 C400,300 700,260 1000,180 C1200,100 1400,130 1700,230;
        M-50,220 C400,380 700,200 1000,120 C1200,50 1400,80 1700,180
      " dur="8s" repeatCount="indefinite" />
    </path>
    <path stroke="url(#grad-line-cyan)">
      <animate attributeName="d" values="
        M-50,250 C400,410 700,230 1000,150 C1200,80 1400,110 1700,210;
        M-50,300 C400,330 700,290 1000,210 C1200,130 1400,160 1700,260;
        M-50,250 C400,410 700,230 1000,150 C1200,80 1400,110 1700,210
      " dur="8s" repeatCount="indefinite" />
    </path>
    <path stroke="url(#grad-line-cyan)">
      <animate attributeName="d" values="
        M-50,280 C400,440 700,260 1000,180 C1200,110 1400,140 1700,240;
        M-50,330 C400,360 700,320 1000,240 C1200,160 1400,190 1700,290;
        M-50,280 C400,440 700,260 1000,180 C1200,110 1400,140 1700,240
      " dur="8s" repeatCount="indefinite" />
    </path>

    <!-- Bottom-Right Cyber Stream (Magenta) -->
    <path stroke="url(#grad-line-magenta)">
      <animate attributeName="d" values="
        M300,1100 C600,1020 900,740 1400,880 C1600,940 1750,860 1970,910;
        M300,1100 C600,960 900,800 1400,820 C1600,880 1750,920 1970,860;
        M300,1100 C600,1020 900,740 1400,880 C1600,940 1750,860 1970,910
      " dur="9s" repeatCount="indefinite" />
    </path>
    <path stroke="url(#grad-line-magenta)">
      <animate attributeName="d" values="
        M300,1100 C600,1000 900,760 1400,860 C1600,920 1750,840 1970,890;
        M300,1100 C600,940 900,820 1400,800 C1600,860 1750,900 1970,840;
        M300,1100 C600,1000 900,760 1400,860 C1600,920 1750,840 1970,890
      " dur="9s" repeatCount="indefinite" />
    </path>
  </g>

  <!-- C. Multi-Layer Overlapping Fluid Waves (Beautiful depth & transparency blending) -->
  
  <!-- 1. Magenta Wave - Layer 1 (Back, Translucent) -->
  <path fill="url(#grad-magenta-2)" opacity="0.45" filter="url(#shadow-deep)">
    <animate attributeName="d" values="
      M1970,-50 L680,-50 C800,260 900,160 1100,280 C1300,400 1500,100 1970,140 Z;
      M1970,-50 L750,-50 C830,220 950,220 1120,260 C1290,300 1490,180 1970,180 Z;
      M1970,-50 L680,-50 C800,260 900,160 1100,280 C1300,400 1500,100 1970,140 Z
    " dur="11s" repeatCount="indefinite" />
  </path>
  
  <!-- 2. Magenta Wave - Layer 2 (Front, Luminous) -->
  <path fill="url(#grad-magenta-1)" filter="url(#shadow-deep)">
    <animate attributeName="d" values="
      M1970,-50 L750,-50 C850,300 950,200 1150,320 C1350,440 1550,150 1970,180 Z;
      M1970,-50 L820,-50 C900,250 1020,250 1200,300 C1380,350 1580,220 1970,220 Z;
      M1970,-50 L700,-50 C800,330 900,180 1100,340 C1300,500 1500,120 1970,140 Z;
      M1970,-50 L750,-50 C850,300 950,200 1150,320 C1350,440 1550,150 1970,180 Z
    " dur="9s" repeatCount="indefinite" />
  </path>

  <!-- 3. Purple Wave - Layer 1 (Back, Translucent) -->
  <path fill="url(#grad-purple-2)" opacity="0.5" filter="url(#shadow-deep)">
    <animate attributeName="d" values="
      M-50,-50 L800,-50 C700,220 600,420 400,480 C200,550 50,520 -50,640 Z;
      M-50,-50 L700,-50 C600,260 500,460 300,500 C100,540 50,460 -50,560 Z;
      M-50,-50 L800,-50 C700,220 600,420 400,480 C200,550 50,520 -50,640 Z
    " dur="9s" repeatCount="indefinite" />
  </path>

  <!-- 4. Purple Wave - Layer 2 (Front, Luminous) -->
  <path fill="url(#grad-purple-1)" filter="url(#shadow-deep)">
    <animate attributeName="d" values="
      M-50,-50 L850,-50 C750,250 650,450 450,520 C250,600 50,580 -50,700 Z;
      M-50,-50 L750,-50 C650,300 550,500 350,550 C150,600 50,500 -50,620 Z;
      M-50,-50 L900,-50 C800,220 700,400 480,500 C260,600 50,620 -50,740 Z;
      M-50,-50 L850,-50 C750,250 650,450 450,520 C250,600 50,580 -50,700 Z
    " dur="7s" repeatCount="indefinite" />
  </path>

  <!-- 5. Bottom Right Wave - Layer 1 (Back, Translucent) -->
  <path fill="url(#grad-magenta-2)" opacity="0.45" filter="url(#shadow-deep)">
    <animate attributeName="d" values="
      M1970,1130 L1280,1130 C1280,1020 1330,920 1420,830 C1580,680 1730,800 1970,720 Z;
      M1970,1130 L1350,1130 C1330,950 1370,860 1480,780 C1630,700 1780,820 1970,800 Z;
      M1970,1130 L1280,1130 C1280,1020 1330,920 1420,830 C1580,680 1730,800 1970,720 Z
    " dur="10s" repeatCount="indefinite" />
  </path>

  <!-- 6. Bottom Right Wave - Layer 2 (Front, Luminous) -->
  <path fill="url(#grad-magenta-1)" filter="url(#shadow-deep)">
    <animate attributeName="d" values="
      M1970,1130 L1350,1130 C1350,1050 1380,950 1500,850 C1650,720 1800,850 1970,800 Z;
      M1970,1130 L1420,1130 C1400,1000 1420,900 1550,820 C1700,740 1850,880 1970,850 Z;
      M1970,1130 L1300,1130 C1300,1080 1350,980 1460,880 C1600,750 1780,820 1970,760 Z;
      M1970,1130 L1350,1130 C1350,1050 1380,950 1500,850 C1650,720 1800,850 1970,800 Z
    " dur="8s" repeatCount="indefinite" />
  </path>
</svg>`,
  },
];

const DEFAULT_PRESET_METADATA: Record<string, { title: string; keywords: string }> = {
  "Glowing Neon Pulse": {
    title: "Glowing Neon Loading Pulse Animation, Green Screen Background Loop",
    keywords: "neon, pulse, green screen, chroma key, loading spinner, loading loop, progress bar, glowing circle, futuristic, interface, loader, waiting screen, design element, animation, flat design"
  },
  "Stock Cyber Portal": {
    title: "Cyberpunk HUD Portal Interface, Neon Cyan and Magenta Sci-Fi Core",
    keywords: "cyberpunk, hud, portal, neon, sci-fi, science fiction, technology, cyberspace, network core, tech grid, magenta, cyan, motion graphic, loading screen, high tech, geometric loop"
  },
  "Modern Floating Waves": {
    title: "Abstract Glassmorphism Fluid Waves Loop, Neon Aurora Tech Flow",
    keywords: "abstract, fluid wave, waves, glassmorphism, aurora, liquid, tech flow, contour line, dot matrix, purple, magenta, gradient flow, vector motion, modern background, soft glow"
  }
};


export default function VideoConverterPage() {
  const [svgCode, setSvgCode] = useState(SVG_PRESETS[0].code);
  const [resolution, setResolution] = useState("3840x2160"); // 4K default
  const [fps, setFps] = useState("30");
  const [duration, setDuration] = useState("5");
  const [codec, setCodec] = useState<"h264" | "vp9" | "prores">("h264");
  const [isExporting, setIsExporting] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(true);
  const [bgPattern, setBgPattern] = useState<"dark" | "checker" | "light">("light");
  const [copied, setCopied] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<{
    duration?: number;
    fps?: number;
    width?: number;
    height?: number;
    fileSize?: string;
    codec?: "h264" | "vp9" | "prores";
  } | null>(null);

  const [progressState, setProgressState] = useState<{
    stage: string;
    progress: number;
  } | null>(null);

  const [activeMobileTab, setActiveMobileTab] = useState<"editor" | "preview">("editor");
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [activePresetName, setActivePresetName] = useState(SVG_PRESETS[0].name);
  const [metadataTitle, setMetadataTitle] = useState("");
  const [metadataKeywords, setMetadataKeywords] = useState("");
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for Escape key to close fullscreen preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreenPreview(false);
      }
    };
    if (isFullscreenPreview) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenPreview]);

  // Debounced preview key updater
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewKey((prev) => prev + 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [svgCode]);

  // Elapsed timer during export
  useEffect(() => {
    if (isExporting) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExporting]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    if (!svgCode.trim() || !svgCode.includes("<svg")) {
      toast.error("Invalid SVG", {
        description: "Please provide valid SVG code containing an <svg> element.",
      });
      return;
    }

    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration < 5 || parsedDuration > 60) {
      toast.error("Invalid Duration", {
        description: "Duration must be between 5 and 60 seconds (Stock Standard).",
      });
      return;
    }

    setIsExporting(true);
    setGeneratedVideoUrl(null);
    setVideoDetails(null);
    setProgressState({ stage: "Preparing WebCodecs renderer...", progress: 5 });

    try {
      const [width, height] = resolution.split("x").map(Number);
      
      const videoBlob = await clientRenderVideo({
        svgCode,
        width,
        height,
        fps: parseInt(fps, 10),
        duration: parsedDuration,
        codec: codec === 'vp9' ? 'vp9' : 'h264',
        onProgress: (progress, stage) => {
          setProgressState({ progress, stage });
        }
      });

      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);

      const mb = (videoBlob.size / (1024 * 1024)).toFixed(2);
      const details = {
        videoUrl,
        duration: parsedDuration,
        fps: parseInt(fps, 10),
        width,
        height,
        fileSize: `${mb} MB`,
        codec: codec as 'h264' | 'vp9' | 'prores',
      };
      setVideoDetails(details);

      toast.success("Video Rendered Successfully!", {
        description: `Rendered ${width}x${height} MP4 ready for download.`,
      });

      // Automatically populate default offline metadata immediately on completion
      const defaultMeta = DEFAULT_PRESET_METADATA[activePresetName] || {
        title: `${activePresetName === "Custom SVG" ? "Custom" : activePresetName} SVG Animation Loop, Modern Graphic Design Vector Video`,
        keywords: "custom svg, svg animation, vector motion, graphic design, abstract vector, loop animation, overlay, web animation, custom design"
      };
      setMetadataTitle(defaultMeta.title);
      setMetadataKeywords(defaultMeta.keywords);



    } catch (err: any) {
      console.error("Client render error:", err);
      toast.error("Render Failed", {
        description: err.message || "An error occurred during rendering in the browser.",
      });
    } finally {
      setIsExporting(false);
      setProgressState(null);
    }
  };

  const handleGenerateAIMetadata = async () => {
    setIsGeneratingMetadata(true);
    toast.loading("Generating optimized marketplace metadata...", { id: "meta-toast" });
    try {
      const response = await fetch("/api/video/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presetName: activePresetName,
          svgCode: svgCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate metadata");
      }

      const result = await response.json();
      if (result.title) setMetadataTitle(result.title);
      if (result.keywords) setMetadataKeywords(result.keywords);

      toast.success("AI Metadata Generated Successfully!", { id: "meta-toast" });
    } catch (err: any) {
      console.error(err);
      toast.error("AI Metadata Generation Failed", {
        id: "meta-toast",
        description: err.message || "Could not connect to Gemini API."
      });
    } finally {
      setIsGeneratingMetadata(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#eaeaea] text-[#2e2e2e] selection:bg-[#5bb75b] selection:text-white font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#ced4da] bg-white sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-full mx-auto flex flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/logo.jpg" 
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-[4px] object-cover shadow-sm shrink-0 border border-[#ced4da]" 
              alt="SVG to MP4 Studio Logo" 
            />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-[#2e2e2e] uppercase font-sans">
                  SVG to MP4 <span className="text-[#5bb75b] font-normal">Studio</span>
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-[3px] bg-[#f8f9fa] text-[#6c757d] border border-[#ced4da] hidden xs:inline-block">
                  Utility
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#6c757d] font-sans hidden sm:block">
                Convert animated SVGs (SMIL, CSS) into high quality H.264 MP4 & ProRes MOV files.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-end shrink-0">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="default"
              className="bg-[#5bb75b] hover:bg-[#449d44] text-white font-semibold shadow-sm border-0 rounded-[4px] transition-all duration-150 active:scale-95 disabled:opacity-50 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5 sm:mr-2" />
                  Rendering...
                </>
              ) : (
                "Export Video"
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Sticky Mobile Tab Selector */}
      <div className="lg:hidden bg-white border-b border-[#ced4da] p-2 flex gap-2 sticky top-[53px] sm:top-[65px] z-30 shadow-sm">
        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-[4px] border transition-all cursor-pointer ${
            activeMobileTab === 'editor'
              ? 'bg-[#5bb75b] border-[#5bb75b] text-white'
              : 'bg-white border-[#ced4da] text-slate-700 hover:bg-slate-50'
          }`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setActiveMobileTab('preview')}
          className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-[4px] border transition-all cursor-pointer ${
            activeMobileTab === 'preview'
              ? 'bg-[#5bb75b] border-[#5bb75b] text-white'
              : 'bg-white border-[#ced4da] text-slate-700 hover:bg-slate-50'
          }`}
        >
          Preview & Settings
        </button>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-full w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor & Presets (7 cols) */}
        <section className={cn("lg:col-span-7 flex flex-col gap-4 w-full", activeMobileTab !== 'editor' && "hidden lg:flex")}>
          <SVGEditor
            svgCode={svgCode}
            onChange={(val) => {
              setSvgCode(val);
              const matchingPreset = SVG_PRESETS.find((p) => p.code === val);
              if (matchingPreset) {
                setActivePresetName(matchingPreset.name);
              } else {
                setActivePresetName("Custom SVG");
              }
            }}
            presets={SVG_PRESETS}
            activePresetName={activePresetName}
            onPresetChange={(val) => {
              const preset = SVG_PRESETS.find((p) => p.name === val);
              if (preset) {
                setSvgCode(preset.code);
                setActivePresetName(preset.name);
                const defaultMeta = DEFAULT_PRESET_METADATA[preset.name];
                if (defaultMeta) {
                  setMetadataTitle(defaultMeta.title);
                  setMetadataKeywords(defaultMeta.keywords);
                }
                toast.info(`Loaded "${preset.name}" preset`);
              }
            }}
            copied={copied}
            onCopyCode={handleCopyCode}
            onUploadSVG={(code) => {
              setSvgCode(code);
              const matchingPreset = SVG_PRESETS.find((p) => p.code === code);
              if (matchingPreset) {
                setActivePresetName(matchingPreset.name);
              } else {
                setActivePresetName("Custom SVG");
              }
            }}
          />
        </section>

        {/* Right Column: Live Preview, Settings & Render Progress (5 cols) */}
        <section className={cn("lg:col-span-5 flex flex-col gap-6 w-full", activeMobileTab !== 'preview' && "hidden lg:flex")}>
          <VideoPreview
            svgCode={svgCode}
            bgPattern={bgPattern}
            setBgPattern={setBgPattern}
            previewKey={previewKey}
            onRestartPreview={() => setPreviewKey((k) => k + 1)}
            onFullscreenTrigger={() => setIsFullscreenPreview(true)}
          />

          <RenderSettings
            resolution={resolution}
            setResolution={setResolution}
            fps={fps}
            setFps={setFps}
            codec={codec}
            setCodec={setCodec}
            duration={duration}
            setDuration={setDuration}
          />

          {/* Render Progress Card (Shown when exporting) */}
          {isExporting && (
            <div className="rounded-[4px] border border-[#5bb75b]/20 bg-white p-5 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#5bb75b]" />
                  <span className="text-sm font-semibold text-[#2e2e2e] font-sans">
                    {progressState?.stage || "Rendering Video..."}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#5bb75b]">
                  {progressState?.progress || 0}% • {elapsedTime}s
                </span>
              </div>

              {/* Glowing Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#5bb75b] to-[#84c53c] transition-all duration-500 shadow-md shadow-[#5bb75b]/10"
                  style={{ width: `${Math.max(5, progressState?.progress || 0)}%` }}
                />
              </div>

              <p className="text-[11px] text-[#6c757d] mt-2.5 text-center font-sans">
                Rendering SVG frames with Remotion Headless Chrome & H.264 encoder...
              </p>
            </div>
          )}

          {/* Rendered Video Showcase */}
          {generatedVideoUrl && !isExporting && (
            <div className="rounded-[4px] border border-emerald-500/30 bg-white overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#ced4da] bg-[#f8f9fa]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-[#2e2e2e] font-sans">
                    Video Ready for Download
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsMetadataModalOpen(true)}
                    className="inline-flex items-center justify-center h-8 px-3 rounded-[4px] bg-slate-100 hover:bg-slate-200 border border-[#ced4da] text-[#2e2e2e] text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#5bb75b]" />
                    SEO Metadata
                  </Button>
                  <a
                    href={generatedVideoUrl}
                    download={videoDetails?.codec === "prores" ? "stock-video-prores.mov" : "stock-video.mp4"}
                    className="inline-flex items-center justify-center h-8 px-4 rounded-[4px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download {videoDetails?.codec === "prores" ? "ProRes MOV" : "MP4"}
                  </a>
                </div>
              </div>

              <div className="p-4 bg-black flex flex-col items-center justify-center w-full">
                {videoDetails?.codec === "prores" ? (
                  <div className="h-[200px] w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-[4px] bg-slate-50">
                    <AlertCircle className="h-8 w-8 text-amber-600 mb-2.5" />
                    <h3 className="text-xs font-semibold text-[#2e2e2e] mb-1 font-sans">ProRes Preview Unsupported in Browser</h3>
                    <p className="text-[10px] text-[#6c757d] max-w-xs leading-relaxed font-sans">
                      Apple ProRes 422 is a professional production codec and cannot be played directly inside web browsers. Please download the file to view it.
                    </p>
                  </div>
                ) : (
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-[280px] w-auto rounded-[4px] shadow-2xl border border-white/5 bg-black"
                  />
                )}

                {videoDetails && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-500 font-mono">
                    <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 border border-[#ced4da] font-bold uppercase text-[#5bb75b]">
                      {videoDetails.codec || 'h264'}
                    </span>
                    <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 border border-[#ced4da]">
                      {videoDetails.width}x{videoDetails.height}
                    </span>
                    <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 border border-[#ced4da]">
                      {videoDetails.fps} FPS
                    </span>
                    <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 border border-[#ced4da]">
                      {videoDetails.duration}s Duration
                    </span>
                    {videoDetails.fileSize && (
                      <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                        {videoDetails.fileSize}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}


        </section>
      </main>

      {/* Fullscreen SVG Preview Modal */}
      {isFullscreenPreview && (
        <FullscreenModal
          svgCode={svgCode}
          bgPattern={bgPattern}
          setBgPattern={setBgPattern}
          onClose={() => setIsFullscreenPreview(false)}
        />
      )}

      {/* Marketplace SEO Kit Modal */}
      {isMetadataModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsMetadataModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[4px] border border-[#ced4da] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-4 top-4 z-10 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setIsMetadataModalOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="p-1">
              <MarketplaceSEOKit
                metadataTitle={metadataTitle}
                setMetadataTitle={setMetadataTitle}
                metadataKeywords={metadataKeywords}
                setMetadataKeywords={setMetadataKeywords}
                isGeneratingMetadata={isGeneratingMetadata}
                onGenerateAIMetadata={handleGenerateAIMetadata}
                videoDetails={videoDetails}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
