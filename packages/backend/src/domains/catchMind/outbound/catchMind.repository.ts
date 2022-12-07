import { CatchMind, Player } from "../entity/catchMind";
import { CatchMindRepositoryDataPort } from "./catchMind.repository.port";
import { redisCli } from "../../../config/redis";

interface PlayerData {
  id: string;
  score: number;
  isReady: boolean;
}

interface GameData {
  keyword: string;
  goalScore: number;
  currentRound: number;
  roundTime: number;
  totalRound: number;
  players: PlayerData[];
  roomId: string;
  turnPlayerIdx: number;
}

export class CatchMindRepository implements CatchMindRepositoryDataPort {
  save(game: CatchMind) {
    const gameData = this.stringify(game);
    redisCli.set(game.roomId, gameData);
  }

  async findById(id: string) {
    const data = await redisCli.get(id);
    if (!data) return;
    console.log(this.parse(JSON.parse(data)));
    return this.parse(JSON.parse(data));
  }

  async delete(roomId: string) {
    if (await redisCli.isExists(roomId)) redisCli.del(roomId);
  }

  parse(data: GameData) {
    data.players = data.players.map(
      ({ id, score, isReady }: PlayerData) => new Player(id, score, isReady)
    );

    return new CatchMind(data);
  }

  stringify(game: CatchMind): string {
    const gameData: GameData = game;

    return JSON.stringify(gameData);
  }
}
