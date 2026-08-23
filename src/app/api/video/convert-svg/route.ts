import { NextResponse } from 'next/server';
import { addVideoJob } from '@/lib/video/video.queue';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { svgCode, fps = 30, duration = 5, width = 1920, height = 1080, codec = 'h264' } = body;

    if (!svgCode || typeof svgCode !== 'string' || !svgCode.trim()) {
      return NextResponse.json({ success: false, message: 'SVG code is required' }, { status: 400 });
    }

    if (!svgCode.includes('<svg')) {
      return NextResponse.json({ success: false, message: 'Invalid SVG format. Must contain an <svg> tag.' }, { status: 400 });
    }

    const parsedFps = Number(fps) || 30;
    const parsedDuration = Math.min(60, Math.max(5, Number(duration) || 5));
    const parsedWidth = Number(width) || 1920;
    const parsedHeight = Number(height) || 1080;

    const job = await addVideoJob({
      svgCode: svgCode.trim(),
      fps: parsedFps,
      duration: parsedDuration,
      width: parsedWidth,
      height: parsedHeight,
      codec: codec === 'prores' ? 'prores' : 'h264',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Video rendering job queued successfully',
      jobId: job.id
    }, { status: 202 });

  } catch (error: any) {
    console.error('Video queuing error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}

