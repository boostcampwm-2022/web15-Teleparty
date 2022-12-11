import { CatchMind, Player } from "../entity/catchMind";
import { CatchMindRepositoryDataPort } from "../useCases/catchMind.repository.port";
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
  static lock: Map<string, ((value: unknown) => void)[]> = new Map();

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
    if (await redisCli.exists(`CatchMind/${roomId}`))
      redisCli.del(`CatchMind/${roomId}`);
  }

  getLock(id: string) {
    if (!CatchMindRepository.lock.has(id)) {
      CatchMindRepository.lock.set(id, []);
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise((resolve) => {
        CatchMindRepository.lock.get(id)?.push(resolve);
      });
    }
  }

  release(id: string) {
    if (CatchMindRepository.lock.has(id)) {
      const blockedList = CatchMindRepository.lock.get(id);

      if (blockedList!.length <= 1) {
        CatchMindRepository.lock.delete(id);
      } else {
        CatchMindRepository.lock.set(id, blockedList!.slice(1));
      }

      if (blockedList![0]) {
        blockedList![0](1);
      }
    }
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
