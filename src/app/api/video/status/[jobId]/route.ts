import { NextResponse } from 'next/server';
import { videoQueue } from '@/lib/video/video.queue';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> | { jobId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { jobId } = resolvedParams;

    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Job ID is required' }, { status: 400 });
    }

    const job = await videoQueue.getJob(jobId);
    
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }
    
    const state = await job.getState();
    const progress = job.progress;
    const stage = job.stage || '';
    
    return NextResponse.json({
      success: true,
      jobId: job.id,
      state,
      progress,
      stage,
      result: job.returnvalue,
      error: job.failedReason
    });
  } catch (error: any) {
    console.error('Job status retrieval error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}

