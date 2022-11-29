import { PlayerPort } from "../inbound/player.port";
import {
  PlayerApiPort,
  PlayerRepositoryDataPort,
} from "../outbound/player.port";
import { PlayerApiAdapter } from "../outbound/player.api.adapter";
import { PlayerRepository } from "../outbound/player.repository";

export class PlayerService implements PlayerPort {
  playerApiAdapter: PlayerApiPort;
  playerRepository: PlayerRepositoryDataPort;

  constructor() {
    this.playerApiAdapter = new PlayerApiAdapter();
    this.playerRepository = new PlayerRepository();
  }

  createPlayer(
    peerId: string,
    userName: string,
    avata: string,
    roomId: string
  ) {
    const checkPlayer = this.playerRepository.findOneByPeerId(peerId);

    // 중복 입장 체크
    if (checkPlayer) {
      return;
    }

    const player = this.playerRepository.create(peerId, userName, avata);

    // roomController로 join 실행
    this.playerApiAdapter.joinPlayer(player.peerId, roomId);

    return;
  }

  leavePlayer(peerId: string) {
    this.playerRepository.deleteByPeerId(peerId);

    // roomController로 leave 실행
    this.playerApiAdapter.leavePlayer(peerId);
    return;
  }

  getAllPlayer() {
    return this.playerRepository.findAll();
  }
}
