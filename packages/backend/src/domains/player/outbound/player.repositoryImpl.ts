import { Player } from "../entity/player.entitiy";
import { PlayerRepository } from "./player.port";

export class PlayerRepositoryImpl implements PlayerRepository {
  private static players: Player[] = [];

  create(peerId: string, userName: string, avata: string) {
    const player = new Player(peerId, userName, avata);
    PlayerRepositoryImpl.players.push(player);
    return player;
  }

  deleteByPeerId(peerId: string) {
    PlayerRepositoryImpl.players = PlayerRepositoryImpl.players.filter(
      (player) => {
        return player.peerId !== peerId;
      }
    );

    return;
  }

  findOneByPeerId(peerId: string) {
    return PlayerRepositoryImpl.players.find((player) => {
      return player.peerId === peerId;
    });
  }

  findAll() {
    return [...PlayerRepositoryImpl.players];
  }
}
