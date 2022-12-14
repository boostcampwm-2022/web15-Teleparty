import { Garticphone } from "../entity/garticphone";
import { GarticphoneRepositoryDataPort } from "../useCases/ports/garitcphone.repository.port";
import { redisCli } from "../../../config/redis";
import { RedisLock } from "../../../utils/redisLock";
import { GarticGameData, GarticPlayerData } from "../../../types/gartic.type";
import { Player } from "../entity/player";
import { AlbumData } from "../entity/albumData";

export class GarticphoneRepository
  extends RedisLock
  implements GarticphoneRepositoryDataPort
{
  async save(game: Garticphone) {
    const gameData = JSON.stringify(game);
    return await redisCli.set(this.getDataKey(game.roomId), gameData);
  }

  async findById(id: string) {
    if (!(await redisCli.exists(this.getDataKey(id)))) return;

    await super.tryLock(this.getLockKey(id));
    // await super.tryLock(this.getDataKey(id), this.getLockKey(id));
    const data = await redisCli.get(this.getDataKey(id));
    if (!data) return;

    return this.parse(JSON.parse(data));
  }

  release(id: string) {
    super.release(this.getLockKey(id));
    // await super.release(this.getDataKey(id), this.getLockKey(id));
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
