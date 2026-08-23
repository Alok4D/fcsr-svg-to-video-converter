import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { videoQueue } from '@/lib/video/video.queue';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> | { jobId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { jobId } = resolvedParams;

    if (!jobId) {
      return new NextResponse('Job ID is required', { status: 400 });
    }

    // First, check if the job has a Cloudinary URL stored in the queue/DB
    const job = await videoQueue.getJob(jobId);
    if (job?.returnvalue?.videoUrl && job.returnvalue.videoUrl.startsWith('http')) {
      // Redirect to Cloudinary CDN URL directly — zero server bandwidth used
      return NextResponse.redirect(job.returnvalue.videoUrl, { status: 302 });
    }

    // Fallback: serve the file locally (e.g. if Cloudinary upload failed)
    let filePath = path.join(process.cwd(), 'uploads', `video-${jobId}.mp4`);
    let fileExt = 'mp4';
    let contentType = 'video/mp4';

    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'uploads', `video-${jobId}.mov`);
      fileExt = 'mov';
      contentType = 'video/quicktime';
    }
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Video not found or still processing', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const nodeStream = fs.createReadStream(filePath);
    
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      }
    });
    
    return new NextResponse(webStream as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Accept-Ranges': 'bytes',
        'Content-Disposition': `inline; filename="video-${jobId}.${fileExt}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return new NextResponse(error.message || 'Internal server error', { status: 500 });
  }
}
