import {
  CatchMind,
  Player,
  PlayerData,
  CatchMindData,
} from "../entity/catchMind";
import { CatchMindRepositoryDataPort } from "../useCases/catchMind.repository.port";
import { redisCli } from "../../../config/redis";
import { RedisLock } from "../../../utils/redisLock";

export class CatchMindRepository
  extends RedisLock
  implements CatchMindRepositoryDataPort
{
  static lock: Map<string, ((value: unknown) => void)[]> = new Map();

  save(game: CatchMind) {
    const gameData = JSON.stringify(game);
    return redisCli.set(`CatchMind/${game.roomId}`, gameData);
  }

  async findById(id: string) {
    await super.tryLock(this.getLockKey(id));
    const data = await redisCli.get(`CatchMind/${id}`);
    if (!data) return;

    return this.parse(JSON.parse(data));
  }

  async delete(roomId: string) {
    if (await redisCli.exists(`CatchMind/${roomId}`))
      redisCli.del(`CatchMind/${roomId}`);
  }

  parse(data: CatchMindData) {
    data.players = data.players.map(
      ({ id, score, isReady }: PlayerData) => new Player({ id, score, isReady })
    );

    return new CatchMind(data);
  }

  async release(id: string) {
    await super.release(this.getLockKey(id));
  }

  getDataKey(id: string) {
    return `CatchMind/${id}`;
  }

  getLockKey(id: string) {
    return `CatchMind-lock/${id}`;
  }
}
