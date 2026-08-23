import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

export interface ClientRenderOptions {
  svgCode: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  onProgress: (progress: number, stage: string) => void;
}

export async function clientRenderVideo({
  svgCode,
  width,
  height,
  fps,
  duration,
  onProgress,
}: ClientRenderOptions): Promise<Blob> {
  const totalFrames = Math.max(1, Math.round(duration * fps));
  onProgress(5, 'Initializing WebCodecs & MP4 Muxer...');

  // 1. Determine supported codec profile (prefer H.264, fall back to VP9)
  const h264Profiles = [
    'avc1.4d401f', // H.264 Main Profile, Level 3.1
    'avc1.4d4028', // H.264 Main Profile, Level 4.0
    'avc1.640028', // H.264 High Profile, Level 4.0
    'avc1.42e01f', // H.264 Baseline Profile, Level 3.1
  ];

  let selectedCodecType: 'avc' | 'vp9' = 'avc';
  let selectedCodecString = '';
  let encoderConfig: VideoEncoderConfig | null = null;

  // Try H.264 first
  for (const profile of h264Profiles) {
    const config: VideoEncoderConfig = {
      codec: profile,
      width: width,
      height: height,
      bitrate: 20_000_000, // 20 Mbps high quality
      avc: { format: 'avc' },
    };

    try {
      const isSupported = await VideoEncoder.isConfigSupported(config);
      if (isSupported.supported) {
        selectedCodecType = 'avc';
        selectedCodecString = profile;
        encoderConfig = config;
        break;
      }
    } catch (e) {
      // Continue to next profile check
    }
  }

  // Fall back to VP9 if H.264 is unsupported
  if (!selectedCodecString) {
    const vp9Config: VideoEncoderConfig = {
      codec: 'vp09.00.10.08', // VP9 Profile 0, Level 1.0, 8-bit
      width: width,
      height: height,
      bitrate: 20_000_000, // 20 Mbps high quality
    };

    try {
      const isSupported = await VideoEncoder.isConfigSupported(vp9Config);
      if (isSupported.supported) {
        selectedCodecType = 'vp9';
        selectedCodecString = 'vp09.00.10.08';
        encoderConfig = vp9Config;
      }
    } catch (e) {
      // Continue
    }
  }

  if (!selectedCodecString || !encoderConfig) {
    throw new Error('Video encoding (H.264/VP9) is not supported in this browser. Please use a modern browser (Chrome or Edge) and verify hardware acceleration is enabled in browser settings.');
  }

  // 2. Initialize MP4 Muxer with the determined codec
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: selectedCodecType,
      width: width,
      height: height,
    },
    fastStart: 'in-memory',
  });

  // 3. Initialize WebCodecs VideoEncoder
  let encodeError: Error | null = null;
  const encoder = new VideoEncoder({
    output: (chunk, metadata) => {
      muxer.addVideoChunk(chunk, metadata);
    },
    error: (err) => {
      console.error('[WebCodecs Encoder Error]:', err);
      encodeError = err;
    },
  });

  encoder.configure(encoderConfig);

  // 3. Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D canvas context.');
  }

  // Helper function to render a single frame of the SVG onto the canvas
  const renderFrameToCanvas = async (frameIndex: number): Promise<void> => {
    const time = frameIndex / fps;

    // Create a temporary container to let browser resolve layout & computed styles
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    try {
      container.innerHTML = svgCode;
      const svgElement = container.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found in the provided code.');
      }

      // Explicitly set width, height, and viewBox to render cleanly on target canvas resolution
      svgElement.setAttribute('width', `${width}`);
      svgElement.setAttribute('height', `${height}`);
      if (!svgElement.getAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }

      // Freeze SMIL animations by injecting begin attribute
      const smilElements = container.querySelectorAll('animate, animateTransform, animateMotion, set');
      smilElements.forEach((el) => {
        el.setAttribute('begin', `${-time}s`);
      });

      // Freeze CSS animations by offsetting delay and setting paused play state
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
          // Ignore styling errors for elements that don't support computed style
        }
      });

      // Serialize the adjusted SVG
      const serializer = new XMLSerializer();
      const serializedSvg = serializer.serializeToString(svgElement);

      // Create Blob URL and load into an image
      const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.src = url;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load SVG frame ${frameIndex} as image`));
      });

      // Draw onto canvas
      ctx.fillStyle = '#000000'; // Fill with black to prevent transparent artifacts
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);
    } finally {
      // Always clean up DOM container
      document.body.removeChild(container);
    }
  };

  // 4. Render loop
  for (let i = 0; i < totalFrames; i++) {
    if (encodeError) {
      throw encodeError;
    }

    const stageProgress = 10 + Math.floor((i / totalFrames) * 80);
    onProgress(stageProgress, `Rendering frame ${i + 1} of ${totalFrames}...`);

    // Render frame to canvas
    await renderFrameToCanvas(i);

    // Create VideoFrame from Canvas
    const timestampUs = Math.round((i / fps) * 1_000_000);
    const videoFrame = new VideoFrame(canvas, { timestamp: timestampUs });

    // Feed VideoFrame to VideoEncoder
    encoder.encode(videoFrame);
    videoFrame.close();

    // Congestion control: prevent encoding queue overflow (keeps memory low)
    while (encoder.encodeQueueSize > 6) {
      await new Promise((r) => setTimeout(r, 10));
    }
  }

  // 5. Finalize video streams
  onProgress(92, 'Finalizing video encoding...');
  await encoder.flush();
  encoder.close();
  muxer.finalize();

  if (encodeError) {
    throw encodeError;
  }

  onProgress(98, 'Packaging final MP4 container...');
  const { buffer } = muxer.target as ArrayBufferTarget;
  onProgress(100, 'Video ready!');

  return new Blob([buffer], { type: 'video/mp4' });
}
