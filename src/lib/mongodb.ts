import mongoose from 'mongoose';
import dns from 'dns';

// Ensure DNS works across diverse environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore in environments where setting DNS servers is restricted
}

let rawUri = process.env.MONGODB_URI || '';

// Normalize SRV URI for cluster0.4hfa9cj.mongodb.net to direct replica set hosts to avoid Windows SRV ECONNREFUSED
function getNormalizedUri(inputUri: string): string {
  if (!inputUri) return '';
  if (inputUri.startsWith('mongodb+srv://') && inputUri.includes('cluster0.4hfa9cj.mongodb.net')) {
    const dbMatch = inputUri.match(/mongodb\.net\/([^?]+)/);
    const dbName = dbMatch ? dbMatch[1] : 'brocart';
    return `mongodb://ratanshakya:9LMdjupbtZ23w2eE@ac-w4rjxek-shard-00-00.4hfa9cj.mongodb.net:27017,ac-w4rjxek-shard-00-01.4hfa9cj.mongodb.net:27017,ac-w4rjxek-shard-00-02.4hfa9cj.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-14fetw-shard-0&authSource=admin&retryWrites=true&w=majority`;
  }
  return inputUri;
}

const MONGODB_URI = getNormalizedUri(rawUri);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; isFallback: boolean }> {
  if (!MONGODB_URI) {
    return { isConnected: false, isFallback: true };
  }

  if (cached.conn) {
    return { isConnected: true, isFallback: false };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`✓ Connected to MongoDB database: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true, isFallback: false };
  } catch (e) {
    cached.promise = null;
    console.warn('MongoDB connection error, falling back to in-memory store:', e);
    return { isConnected: false, isFallback: true };
  }
}
