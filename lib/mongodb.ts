import mongoose, { Mongoose } from 'mongoose';

/**
 * The MongoDB connection string.
 *
 * Must be provided via the MONGODB_URI environment variable.
 * Example:
 *   MONGODB_URI="mongodb+srv://user:password@cluster0.mongodb.net/myDatabase"
 */
const MONGODB_URI = process.env.MONGODB_URI;

// ⚠️ IMPORTANT:
// Do NOT throw here. This file may be imported in env-less contexts (build, edge, etc.)
if (!MONGODB_URI) {
  console.warn(
    '⚠️ MONGODB_URI is not defined. Database connection will fail when connectToDatabase() is called.'
  );
}

/**
 * Shape of the cached Mongoose connection stored on the global object.
 *
 * This is used to:
 * - Reuse the same connection across hot reloads in development
 * - Avoid creating multiple connections in serverless environments
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the Node.js global type so TypeScript knows about our cache.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Initialize cache (persisted across hot reloads)
const globalCache: MongooseCache = globalThis._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis._mongooseCache) {
  globalThis._mongooseCache = globalCache;
}

/**
 * Get a singleton Mongoose connection.
 *
 * - Safe to import in any environment
 * - Fails fast ONLY when a real connection is attempted
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // ✅ Reuse existing connection
  if (globalCache.conn) {
    return globalCache.conn;
  }

  // ✅ Validate env var at call-time (not import-time)
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // ✅ Reuse in-flight connection promise
  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(MONGODB_URI, {
        autoIndex: process.env.NODE_ENV === 'development',
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (error) {
    // Reset promise so future calls can retry
    globalCache.promise = null;
    throw error;
  }

  return globalCache.conn;
}

export type { Mongoose };
