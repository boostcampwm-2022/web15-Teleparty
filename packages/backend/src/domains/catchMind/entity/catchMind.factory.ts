import { CatchMindData, PlayerData } from "../../../types/catchMind.type";
import { CatchMind } from "./catchMind";
import { Player } from "./player";

export class CatchMindFactory {
  static creatCatchMind(data: CatchMindData) {
    const players = this.createPlayerList(data.players);
    const [goalScore, totalRound] = this.calcGameData(data.players.length);
    const keyword = data.keyword || "";
    const currentRound = data.currentRound || 1;
    const turnPlayerIdx = data.turnPlayerIdx || 0;

    return new CatchMind({
      ...data,
      players,
      goalScore,
      totalRound,
      keyword,
      currentRound,
      turnPlayerIdx,
    });
  }

  private static calcGameData(playerNum: number) {
    return [Math.ceil(Math.sqrt(playerNum * 2)), playerNum * 2];
  }

  static createPlayerList(list: PlayerData[] | string[]) {
    if (this.isString(list)) {
      return list.map((id) => new Player({ id }));
    } else {
      return list.map((data) => new Player(data));
    }
  }

  private static isString(data: PlayerData[] | string[]): data is string[] {
    if (typeof data[0] === "string") return true;
    else return false;
  }
}
