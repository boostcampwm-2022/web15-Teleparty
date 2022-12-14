export class RedisLock {
  static lock: Map<string, ((value: unknown) => void)[]> = new Map();

  tryLock(id: string) {
    if (!RedisLock.lock.has(id)) {
      RedisLock.lock.set(id, []);
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise((resolve) => {
        RedisLock.lock.get(id)?.push(resolve);
      });
    }
  }

  release(id: string) {
    if (RedisLock.lock.has(id)) {
      const blockedList = RedisLock.lock.get(id);

      if (blockedList!.length <= 1) {
        RedisLock.lock.delete(id);
      } else {
        RedisLock.lock.set(id, blockedList!.slice(1));
      }

      if (blockedList![0]) {
        blockedList![0](1);
      }
    }
  }
  // async tryLock(dataId: string, lockId: string) {
  //   redisClient.executeIsolated(async (client) => {
  //     if (await redisCli.exists(dataId)) {
  //       await redisCli.blPop(lockId, 10);
  //     }
  //   });
  // }

  // async release(dataId: string, lockId: string) {
  //   if (await redisCli.exists(dataId)) {
  //     await redisCli.lPush(lockId, "lock");
  //   }
  // }
}
