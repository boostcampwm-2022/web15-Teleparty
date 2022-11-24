import { Player } from "../entity/player.entitiy";
import { PlayerRepositoryDataPort } from "./player.port";

export class PlayerRepository implements PlayerRepositoryDataPort {
  private static players: Player[] = [];

  create(peerId: string, userName: string, avata: string) {
    const player = new Player(peerId, userName, avata);
    PlayerRepository.players.push(player);
    return player;
  }

  deleteByPeerId(peerId: string) {
    PlayerRepository.players = PlayerRepository.players.filter((player) => {
      return player.peerId !== peerId;
    });

    return;
  }

  findOneByPeerId(peerId: string) {
    return PlayerRepository.players.find((player) => {
      return player.peerId === peerId;
    });
  }

  findAll() {
    return [...PlayerRepository.players];
  }
}
