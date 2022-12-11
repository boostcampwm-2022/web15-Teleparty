import {
  Garticphone,
  AlbumData,
  Player,
  GarticGameData,
  GarticPlayerData,
} from "../entity/garticphone";
import { GarticphoneRepositoryDataPort } from "../useCases/garitcphone.repository.port";
import { redisCli } from "../../../config/redis";

export class GarticphoneRepository implements GarticphoneRepositoryDataPort {
  async save(game: Garticphone) {
    const gameData = this.stringify(game);
    await redisCli.set(`Gartic/${game.roomId}`, gameData);
  }

  async findById(id: string) {
    console.log("\x1b[32mgetLock\x1b[37m", id);
    await redisCli.blPop(`Gartic-lock/${id}`, 10);
    const data = await redisCli.get(`Gartic/${id}`);
    if (!data) return;

    return this.parse(JSON.parse(data));
  }

  async release(id: string) {
    if (await redisCli.exists(`Gartic/${id}`)) {
      console.log("\x1b[32mrelease\x1b[37m", id);

      await redisCli.lPush(`Gartic-lock/${id}`, "lock");
    }
  }

  async delete(roomId: string) {
    if (await redisCli.exists(`Gartic/${roomId}`)) {
      await redisCli.del(`Gartic/${roomId}`);
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

  stringify(game: Garticphone): string {
    const gameData: GarticGameData = game;
    return JSON.stringify(gameData);
  }
}
