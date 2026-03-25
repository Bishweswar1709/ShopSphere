import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const client = createClient({
  url: process.env.UPSTASH_REDIS_URL,
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

export const connectRedis = async () => {
  try {
    console.log("REDIS URL:", process.env.UPSTASH_REDIS_URL); // debug

    await client.connect();
    console.log("✅ Redis connected");

  } catch (error) {
    console.error("Redis connection failed:", error.message);
  }
};