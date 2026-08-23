import mongoose, { Schema, Document } from 'mongoose';

export interface IRenderJob extends Document {
  jobId: string;
  state: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  stage: string;
  data: {
    svgCode: string;
    fps: number;
    duration: number;
    width: number;
    height: number;
    codec?: 'h264' | 'prores';
  };
  result: {
    videoUrl: string;
    duration?: number;
    fps?: number;
    width?: number;
    height?: number;
    fileSize?: string;
    codec?: 'h264' | 'prores';
  } | null;
  failedReason: string | null;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

const RenderJobSchema: Schema = new Schema(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    state: { type: String, required: true, enum: ['waiting', 'active', 'completed', 'failed'], default: 'waiting' },
    progress: { type: Number, required: true, default: 0 },
    stage: { type: String, required: true, default: 'In Queue' },
    data: {
      svgCode: { type: String, required: true },
      fps: { type: Number, required: true },
      duration: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      codec: { type: String, enum: ['h264', 'prores'], default: 'h264' },
    },
    result: {
      videoUrl: { type: String },
      duration: { type: Number },
      fps: { type: Number },
      width: { type: Number },
      height: { type: Number },
      fileSize: { type: String },
      codec: { type: String, enum: ['h264', 'prores'] },
    },
    failedReason: { type: String, default: null },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const RenderJob = mongoose.models.RenderJob || mongoose.model<IRenderJob>('RenderJob', RenderJobSchema);

export default RenderJob;
