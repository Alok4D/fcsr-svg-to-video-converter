import EventEmitter from 'events';
import { dbConnect } from '../db';
import RenderJob from '../../models/Job';

export type JobState = 'waiting' | 'active' | 'completed' | 'failed';

export interface VideoJobData {
  svgCode: string;
  fps: number;
  duration: number;
  width: number;
  height: number;
  codec?: 'h264' | 'prores';
}

export interface VideoJobResult {
  videoUrl: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  fileSize?: string;
  codec?: 'h264' | 'prores';
}

export interface VideoJob {
  id: string;
  data: VideoJobData;
  state: JobState;
  progress: number;
  stage: string;
  returnvalue: VideoJobResult | null;
  failedReason: string | null;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  getState: () => Promise<JobState>;
  updateProgress: (progress: number, stage?: string) => Promise<void>;
}

class VideoJobQueue extends EventEmitter {
  private jobs: Map<string, VideoJob> = new Map();
  private queue: string[] = [];
  private isProcessing = false;
  private processor: ((job: VideoJob) => Promise<VideoJobResult>) | null = null;

  constructor() {
    super();
    // Periodically clean up old completed/failed jobs older than 1 hour from memory
    setInterval(() => {
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      for (const [id, job] of this.jobs.entries()) {
        if ((job.state === 'completed' || job.state === 'failed') && job.createdAt < oneHourAgo) {
          this.jobs.delete(id);
        }
      }
    }, 15 * 60 * 1000);
  }

  public registerProcessor(processor: (job: VideoJob) => Promise<VideoJobResult>) {
    this.processor = processor;
    this.processNext();
  }

  public async add(name: string, data: VideoJobData): Promise<VideoJob> {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const job: VideoJob = {
      id,
      data,
      state: 'waiting',
      progress: 0,
      stage: 'In Queue',
      returnvalue: null,
      failedReason: null,
      createdAt: Date.now(),
      getState: async () => {
        try {
          await dbConnect();
          const dbJob = await RenderJob.findOne({ jobId: id });
          return dbJob ? dbJob.state : job.state;
        } catch {
          return job.state;
        }
      },
      updateProgress: async (progress: number, stage?: string) => {
        job.progress = Math.min(100, Math.max(0, progress));
        if (stage) job.stage = stage;
        this.emit('progress', { jobId: job.id, progress: job.progress, stage: job.stage });
        
        try {
          await dbConnect();
          await RenderJob.updateOne(
            { jobId: job.id },
            { $set: { progress: job.progress, stage: job.stage } }
          );
        } catch (dbErr) {
          console.error(`[Job ${job.id}] Failed to save progress update to MongoDB:`, dbErr);
        }
      },
    };

    // Save to database
    try {
      await dbConnect();
      await RenderJob.create({
        jobId: id,
        state: 'waiting',
        progress: 0,
        stage: 'In Queue',
        data,
        result: null,
        failedReason: null,
      });
    } catch (dbErr) {
      console.error(`[Job ${id}] Failed to create render job document in MongoDB:`, dbErr);
    }

    this.jobs.set(id, job);
    this.queue.push(id);
    this.emit('waiting', job);

    // Trigger processing
    setTimeout(() => this.processNext(), 10);

    return job;
  }

  public async getJob(id: string): Promise<VideoJob | null> {
    const memoryJob = this.jobs.get(id);
    if (memoryJob) return memoryJob;

    // Fallback: Retrieve from MongoDB
    try {
      await dbConnect();
      const dbJob = await RenderJob.findOne({ jobId: id });
      if (!dbJob) return null;

      const job: VideoJob = {
        id: dbJob.jobId,
        data: dbJob.data as any,
        state: dbJob.state,
        progress: dbJob.progress,
        stage: dbJob.stage,
        returnvalue: dbJob.result as any,
        failedReason: dbJob.failedReason,
        createdAt: dbJob.createdAt ? new Date(dbJob.createdAt).getTime() : Date.now(),
        getState: async () => {
          try {
            const currentJob = await RenderJob.findOne({ jobId: id });
            return currentJob ? currentJob.state : 'failed';
          } catch {
            return dbJob.state;
          }
        },
        updateProgress: async () => {}, // Loaded completed jobs do not update progress
      };
      return job;
    } catch (err) {
      console.error(`[MongoDB] Failed to retrieve job ${id}:`, err);
      return null;
    }
  }

  private async processNext() {
    if (this.isProcessing || !this.processor || this.queue.length === 0) {
      return;
    }

    const jobId = this.queue.shift();
    if (!jobId) return;

    const job = this.jobs.get(jobId);
    if (!job) {
      this.processNext();
      return;
    }

    this.isProcessing = true;
    job.state = 'active';
    job.startedAt = Date.now();
    job.stage = 'Starting render process...';
    job.progress = 5;
    this.emit('active', job);

    // Save to database
    try {
      await dbConnect();
      await RenderJob.updateOne(
        { jobId: job.id },
        { $set: { state: 'active', startedAt: new Date(), stage: job.stage, progress: job.progress } }
      );
    } catch (dbErr) {
      console.error(`[Job ${job.id}] Failed to save active state to MongoDB:`, dbErr);
    }

    try {
      const result = await this.processor(job);
      job.state = 'completed';
      job.progress = 100;
      job.stage = 'Completed';
      job.returnvalue = result;
      job.completedAt = Date.now();
      this.emit('completed', job);

      // Save to database
      try {
        await dbConnect();
        await RenderJob.updateOne(
          { jobId: job.id },
          { $set: { state: 'completed', completedAt: new Date(), stage: job.stage, progress: 100, result } }
        );
      } catch (dbErr) {
        console.error(`[Job ${job.id}] Failed to save completed state to MongoDB:`, dbErr);
      }
    } catch (err: any) {
      job.state = 'failed';
      job.failedReason = err?.message || 'Video generation failed';
      job.stage = 'Failed';
      this.emit('failed', job, err);

      // Save to database
      try {
        await dbConnect();
        await RenderJob.updateOne(
          { jobId: job.id },
          { $set: { state: 'failed', stage: 'Failed', failedReason: job.failedReason } }
        );
      } catch (dbErr) {
        console.error(`[Job ${job.id}] Failed to save failed state to MongoDB:`, dbErr);
      }
      console.error(`[Job ${job.id}] Execution failed:`, err);
    } finally {
      this.isProcessing = false;
      this.processNext();
    }
  }
}

const globalForQueue = globalThis as unknown as { videoJobQueue?: VideoJobQueue };
export const videoQueue = globalForQueue.videoJobQueue || new VideoJobQueue();
globalForQueue.videoJobQueue = videoQueue;

export const addVideoJob = async (jobData: VideoJobData) => {
  return await videoQueue.add('render', jobData);
};
