import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI || 'mongodb://127.0.0.1:27017/drawtogether'

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set; falling back to local MongoDB')
}

let cached: any = (globalThis as any).__mongoose_cache
if (!cached) {
  cached = globalThis.__mongoose_cache = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts: any = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance
      })
      .catch((err) => {
        console.warn('MongoDB connection error:', err?.message || err)
        throw err
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectToDatabase
