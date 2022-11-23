import { Player } from "../entity/player.entitiy";
import { PlayerRepository } from "./player.port";

export class PlayerRepositoryImpl implements PlayerRepository {
  players: Player[];

  constructor() {
    this.players = [];
  }

  create(peerId: string, userName: string, avata: string) {
    const player = new Player(peerId, userName, avata);
    this.players.push(player);
    return player;
  }
}
