import { CatchMind } from "../entity/catchMind";
import { CatchMindRepositoryDataPort } from "../useCases/ports/catchMind.repository.port";
import { redisCli } from "../../../config/redis";
import { RedisLock } from "../../../utils/redisLock";
import { CatchMindData } from "../../../types/catchMind.type";
import { CatchMindFactory } from "../entity/catchMind.factory";
import { Chalk } from "../../../utils/chalk";

export class CatchMindRepository
  extends RedisLock
  implements CatchMindRepositoryDataPort
{
  static lock: Map<string, ((value: unknown) => void)[]> = new Map();

  save(game: CatchMind) {
    const gameData = JSON.stringify(game);
    return redisCli.set(this.getDataKey(game.roomId), gameData);
  }

  async findById(id: string) {
    if (!(await redisCli.exists(this.getDataKey(id)))) return;

    await super.tryLock(this.getLockKey(id));
    const data = await redisCli.get(this.getDataKey(id));
    if (!data) return;

    return this.parse(JSON.parse(data));
  }

  async delete(roomId: string) {
    if (await redisCli.exists(this.getDataKey(roomId)))
      redisCli.del(this.getDataKey(roomId));
  }

  parse(data: CatchMindData) {
    return CatchMindFactory.creatCatchMind(data);
  }

  release(id: string) {
    super.release(this.getLockKey(id));
  }

  getDataKey(id: string) {
    return `CatchMind/${id}`;
  }

  getLockKey(id: string) {
    return `CatchMind-lock/${id}`;
  }
}
