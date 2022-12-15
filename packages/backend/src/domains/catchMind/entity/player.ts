import { PlayerData } from "../../../types/catchMind.type";

export class Player {
  id: string;
  score: number;
  isReady: boolean;

  constructor({ id, score, isReady }: PlayerData) {
    this.id = id;
    this.score = score || 0;
    this.isReady = isReady || false;
  }
}
