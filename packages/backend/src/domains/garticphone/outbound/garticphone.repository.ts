import {
  Garticphone,
  AlbumData,
  Player,
  GarticGameData,
  GarticPlayerData,
} from "../entity/garticphone";
import { GarticphoneRepositoryDataPort } from "./garitcphone.repository.port";
import { redisCli } from "../../../config/redis";

export class GarticphoneRepository implements GarticphoneRepositoryDataPort {
  save(game: Garticphone) {
    const gameData = this.stringify(game);
    redisCli.set(`Gartic/${game.roomId}`, gameData);
    console.log("saved");
  }

  async findById(id: string) {
    const data = await redisCli.get(`Gartic/${id}`);
    if (!data) return;
    return this.parse(JSON.parse(data));
  }

  async delete(roomId: string) {
    if (await redisCli.isExists(`Gartic/${roomId}`))
      redisCli.del(`Gartic/${roomId}`);
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
