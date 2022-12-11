import { redisCli, redisClient } from "../config/redis";

export class RedisLock {
  async createLock(id: string) {
    await redisCli.sAdd("lock", id);
  }

  async getLock(id: string) {
    const result = await redisCli.sRem("lock", id);
    if (result) return;

    const subscriber = redisClient.duplicate();

    return new Promise((resolve) => {
      const callback = async () => {
        const result = await redisCli.sRem("lock", id);
        console.log("try", id, result);
        if (result) {
          resolve(1);
        } else {
          subscriber.subscribe(id, callback);
        }
      };

      subscriber.subscribe(id, callback);
    });
  }

  async release(id: string) {
    const result = await redisCli.sAdd("lock", id);
    if (result === "OK") await redisClient.publish(id, "");
  }
}
