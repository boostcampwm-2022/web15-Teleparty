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
    redisCli.set(`CatchMind/${game.roomId}`, gameData);
  }

  async findById(id: string) {
    const data = await redisCli.get(`CatchMind/${id}`);
    if (!data) return;

    return this.parse(JSON.parse(data));
  }

  async delete(roomId: string) {
    if (await redisCli.isExists(`CatchMind/${roomId}`))
      redisCli.del(`CatchMind/${roomId}`);
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
