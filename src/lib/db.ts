import mongoose from 'mongoose';


interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };

if (process.env.NODE_ENV !== 'production') {
  globalThis.mongooseCache = cached;
}

export async function dbConnect() {
  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    throw new Error('Please define the MONGODB_URL environment variable in your .env file');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB_NAME || 'svg_to_video_db',
    };

    console.log('[MongoDB] Connecting to cluster...');
    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongooseInstance) => {
      console.log('[MongoDB] Connected successfully.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
