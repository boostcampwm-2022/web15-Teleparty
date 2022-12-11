import {
  Garticphone,
  AlbumData,
  Player,
  GarticGameData,
  GarticPlayerData,
} from "../entity/garticphone";
import { GarticphoneRepositoryDataPort } from "../useCases/garitcphone.repository.port";
import { redisCli } from "../../../config/redis";
import { RedisLock } from "../../../utils/redisLock";

export class GarticphoneRepository
  extends RedisLock
  implements GarticphoneRepositoryDataPort
{
  async save(game: Garticphone) {
    const gameData = JSON.stringify(game);
    return await redisCli.set(this.getDataKey(game.roomId), gameData);
  }

  async findById(id: string) {
    await super.tryLock(this.getLockKey(id));
    const data = await redisCli.get(this.getDataKey(id));
    if (!data) return;

    return this.parse(JSON.parse(data));
  }

  async release(id: string) {
    await super.release(this.getDataKey(id), this.getLockKey(id));
  }

  async delete(roomId: string) {
    if (await redisCli.exists(this.getDataKey(roomId))) {
      await redisCli.del(this.getDataKey(roomId));
    }
  }

  parse(data: GarticGameData) {
    data.players = data.players.map(
      ({ id, isInputEnded, isExit, album }: GarticPlayerData) => {
        const player = new Player(id);
        player.isInputEnded = isInputEnded;
        player.isExit = isExit;
        player.album = album.map(
          ({ type, ownerId, data }) => new AlbumData(type, ownerId, data)
        );
        return player;
      }
    );

    return new Garticphone(data);
  }

  getDataKey(id: string) {
    return `Gartic/${id}`;
  }

  getLockKey(id: string) {
    return `Gartic-lock/${id}`;
  }
}
