import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true,
});

redisClient.on("connect", () => {
  console.info("Redis conntect");
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error", error);
});

const connectionRedis = async () => {
  await redisClient.connect();
};

connectionRedis();

export const redisCli = redisClient.v4;
