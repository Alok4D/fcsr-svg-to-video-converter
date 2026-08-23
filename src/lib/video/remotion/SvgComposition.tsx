import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame } from 'remotion';

export type SvgCompositionProps = {
  svgCode: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
};

export const SvgComposition: React.FC<SvgCompositionProps> = ({ svgCode }) => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize SVG attributes to ensure it fits the viewport
  const controlledSvgCode = useMemo(() => {
    if (!svgCode || !svgCode.trim()) return '';
    
    let processed = svgCode.trim();
    
    // If svg tag doesn't have width/height or has fixed width/height, adjust it
    if (!processed.includes('viewBox') && processed.includes('<svg')) {
      // If no viewBox is present, try to extract width and height to form a viewBox
      const wMatch = processed.match(/width=["'](\d+(?:\.\d+)?)["']/);
      const hMatch = processed.match(/height=["'](\d+(?:\.\d+)?)["']/);
      if (wMatch && hMatch) {
        processed = processed.replace(
          /<svg([^>]*)>/i,
          `<svg$1 viewBox="0 0 ${wMatch[1]} ${hMatch[1]}">`
        );
      }
    }

    return processed;
  }, [svgCode]);

  // Synchronize animations on every frame
  useLayoutEffect(() => {
    const time = frame / fps;
    const container = containerRef.current;
    if (!container) return;

    // 1. Sync Native SMIL Animations (SVG <animate>, <animateTransform>, etc.)
    const svgs = container.querySelectorAll('svg');
    svgs.forEach((svg: any) => {
      try {
        if (typeof svg.pauseAnimations === 'function') {
          svg.pauseAnimations();
        }
        if (typeof svg.setCurrentTime === 'function') {
          svg.setCurrentTime(time);
        }
      } catch (err) {
        // Ignore if unsupported in headless
      }
    });

    // 2. Sync CSS Animations
    const allElements = container.querySelectorAll('*');
    allElements.forEach((el: any) => {
      try {
        const computedStyle = window.getComputedStyle(el);
        if (computedStyle.animationName && computedStyle.animationName !== 'none') {
          if (!el.hasAttribute('data-orig-delay')) {
            el.setAttribute('data-orig-delay', computedStyle.animationDelay || '0s');
          }
          const origDelayStr = el.getAttribute('data-orig-delay');
          const origDelaySec = parseFloat(origDelayStr) || 0;
          
          el.style.animationDelay = `${origDelaySec - time}s`;
          el.style.animationPlayState = 'paused';
        }
      } catch (err) {
        // Ignore
      }
    });
  }, [frame, fps]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="[&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
        dangerouslySetInnerHTML={{ __html: controlledSvgCode }}
      />
    </AbsoluteFill>
  );
};
