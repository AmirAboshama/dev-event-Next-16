import mongoose, { Mongoose } from 'mongoose';

/**
 * The MongoDB connection string.
 *
 * Must be provided via the MONGODB_URI environment variable.
 * Example:
 *   MONGODB_URI="mongodb+srv://user:password@cluster0.mongodb.net/myDatabase"
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Failing fast here makes configuration issues obvious during startup
  throw new Error('Please define the MONGODB_URI environment variable');
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
 *
 * We intentionally use `var` on `globalThis` so that the value persists
 * across module reloads in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Initialize the cache on first import. Subsequent imports will reuse this.
const globalCache = globalThis._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis._mongooseCache) {
  globalThis._mongooseCache = globalCache;
}

/**
 * Get a singleton Mongoose connection.
 *
 * This function:
 * - Returns an existing connection if one is already established
 * - Otherwise, creates a new connection and caches both the connection
 *   and the in-flight connection promise
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If we already have an active connection, reuse it.
  if (globalCache.conn) {
    return globalCache.conn;
  }

  // If a connection is already being established, await that promise.
  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(MONGODB_URI, {
        // Recommended options for modern Mongoose + MongoDB drivers
        autoIndex: process.env.NODE_ENV === 'development',
        // Disables mongoose buffering; lets you handle connection errors explicitly
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (error) {
    // If connection fails, reset the promise so future calls can retry
    globalCache.promise = null;
    throw error;
  }

  return globalCache.conn;
}

export type { Mongoose };
