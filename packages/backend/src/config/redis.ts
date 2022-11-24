import dotenv from "dotenv";
import * as redis from "redis";

dotenv.config();

const redisClient = redis.createClient({
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
