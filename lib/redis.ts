import { Redis } from "@upstash/redis";

// Initialize Redis client from environment variables
// Expects UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local
export const redis = Redis.fromEnv();
