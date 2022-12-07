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
  static lock: Map<string, ((value: unknown) => void)[]> = new Map();
  save(game: Garticphone) {
    const gameData = this.stringify(game);
    redisCli.set(`Gartic/${game.roomId}`, gameData);
  }

  async findById(id: string) {
    const data = await redisCli.get(`Gartic/${id}`);
    if (!data) return;

    return this.parse(JSON.parse(data));
  }

  getLock(id: string) {
    if (!GarticphoneRepository.lock.has(id)) {
      GarticphoneRepository.lock.set(id, []);
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise((resolve) => {
        GarticphoneRepository.lock.get(id)?.push(resolve);
      });
    }
  }

  release(id: string) {
    console.log("release", id);
    if (GarticphoneRepository.lock.has(id)) {
      const blockedList = GarticphoneRepository.lock.get(id);

      if (blockedList!.length <= 1) {
        GarticphoneRepository.lock.delete(id);
      } else {
        GarticphoneRepository.lock.set(id, blockedList!.slice(1));
      }

      if (blockedList![0]) {
        blockedList![0](1);
      }
    }
  }

  async delete(roomId: string) {
    if (await redisCli.exists(`Gartic/${roomId}`))
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
