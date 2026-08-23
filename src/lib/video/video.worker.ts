import path from 'path';
import fs from 'fs';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { videoQueue, VideoJob, VideoJobResult } from './video.queue';
import cloudinary from '../cloudinary';

let cachedBundleLocation: string | null = null;
let bundlingPromise: Promise<string> | null = null;

async function getOrBuildBundle(): Promise<string> {
  if (cachedBundleLocation && fs.existsSync(cachedBundleLocation)) {
    return cachedBundleLocation;
  }

  if (bundlingPromise) {
    return bundlingPromise;
  }

  const entryPoint = path.resolve(process.cwd(), 'src/lib/video/remotion/index.ts');
  console.log('[Remotion] Bundling composition from entry point:', entryPoint);

  bundlingPromise = bundle({
    entryPoint,
    webpackOverride: (config) => {
      config.devtool = false; // Disable source maps to save memory on 512MB RAM servers
      return config;
    },
  }).then((loc) => {
    cachedBundleLocation = loc;
    bundlingPromise = null;
    return loc;
  }).catch((err) => {
    bundlingPromise = null;
    throw err;
  });

  return bundlingPromise;
}

export async function processVideoRender(job: VideoJob): Promise<VideoJobResult> {
  const { svgCode, fps = 30, duration = 5, width = 1920, height = 1080, codec = 'h264' } = job.data;
  
  console.log(`[Job ${job.id}] Starting SVG to ${codec.toUpperCase()} render: ${width}x${height} @ ${fps}fps, ${duration}s`);
  await job.updateProgress(10, 'Preparing Remotion renderer...');

  const compositionId = 'SvgVideo';
  const outDir = path.resolve(process.cwd(), 'uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileExt = codec === 'prores' ? 'mov' : 'mp4';
  const outputLocation = path.join(outDir, `video-${job.id}.${fileExt}`);
  const durationInFrames = Math.max(1, Math.round(duration * fps));

  try {
    await job.updateProgress(20, 'Bundling video assets...');
    const bundleLocation = await getOrBuildBundle();

    await job.updateProgress(35, 'Configuring composition settings...');
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: {
        svgCode,
        duration,
        fps,
        width,
        height,
      },
    });

    await job.updateProgress(40, 'Rendering video frames...');
    console.log(`[Job ${job.id}] Rendering ${durationInFrames} frames to ${outputLocation}...`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: codec === 'prores' ? 'prores' : 'h264',
      pixelFormat: codec === 'prores' ? 'yuv422p10le' : 'yuv420p',
      crf: codec === 'prores' ? undefined : 16,
      outputLocation,
      inputProps: {
        svgCode,
        duration,
        fps,
        width,
        height,
      },
      frameRange: [0, durationInFrames - 1],
      imageFormat: 'png',
      onProgress: ({ progress }) => {
        // Map remotion progress (0.0 to 1.0) to (40% to 95%)
        const currentProgress = 40 + Math.floor(progress * 55);
        const percentStr = Math.round(progress * 100);
        job.updateProgress(currentProgress, `Rendering frames (${percentStr}%)...`);
      },
    });

    await job.updateProgress(95, `Uploading to Cloudinary CDN...`);

    // Calculate local file size before uploading
    let formattedSize = '';
    if (fs.existsSync(outputLocation)) {
      const stats = fs.statSync(outputLocation);
      const mb = (stats.size / (1024 * 1024)).toFixed(2);
      formattedSize = `${mb} MB`;
    }

    // Upload rendered video to Cloudinary
    let videoUrl = `/api/video/download/${job.id}`; // fallback to local
    try {
      console.log(`[Job ${job.id}] Uploading to Cloudinary...`);
      const uploadResult = await cloudinary.uploader.upload(outputLocation, {
        resource_type: 'video',
        public_id: `svg-to-video/${job.id}`,
        overwrite: true,
        chunk_size: 6000000, // 6MB chunks for large files
      });
      videoUrl = uploadResult.secure_url;
      console.log(`[Job ${job.id}] Cloudinary upload success: ${videoUrl}`);

      // Delete local file after successful Cloudinary upload
      try {
        fs.unlinkSync(outputLocation);
        console.log(`[Job ${job.id}] Local file deleted after Cloudinary upload.`);
      } catch (deleteErr) {
        console.warn(`[Job ${job.id}] Could not delete local file (non-fatal):`, deleteErr);
      }
    } catch (uploadErr) {
      console.error(`[Job ${job.id}] Cloudinary upload failed, falling back to local URL:`, uploadErr);
      // Keep local file and fallback URL if Cloudinary fails
    }

    await job.updateProgress(100, 'Video ready!');
    console.log(`[Job ${job.id}] Render completed successfully: ${formattedSize}`);

    return {
      videoUrl,
      duration,
      fps,
      width,
      height,
      fileSize: formattedSize,
      codec,
    };
  } catch (error: any) {
    console.error(`[Job ${job.id}] Render error:`, error);
    // Clean up incomplete file if it exists
    if (fs.existsSync(outputLocation)) {
      try {
        fs.unlinkSync(outputLocation);
        console.log(`[Job ${job.id}] Successfully cleaned up incomplete output file: ${outputLocation}`);
      } catch (cleanupErr) {
        console.error(`[Job ${job.id}] Failed to clean up incomplete file:`, cleanupErr);
      }
    }
    throw error;
  }
}

// Register processor on singleton queue
videoQueue.registerProcessor(processVideoRender);
console.log('[Video Worker] Registered render processor.');

