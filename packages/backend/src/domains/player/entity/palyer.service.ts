import { PlayerPort } from "../inbound/player.port";
import {
  PlayerApiPort,
  PlayerEvent,
  PlayerRepositoryDataPort,
} from "../outbound/player.port";
import { PlayerApiAdapter } from "../outbound/player.api.adapter";
import { PlayerRepository } from "../outbound/player.repository";
import { PlayerEventAdapter } from "../outbound/player.event.adapter";

export class PlayerService implements PlayerPort {
  playerApiAdapter: PlayerApiPort;
  playerRepository: PlayerRepositoryDataPort;
  playerEventAdapter: PlayerEvent;

  constructor() {
    this.playerApiAdapter = new PlayerApiAdapter();
    this.playerRepository = new PlayerRepository();
    this.playerEventAdapter = new PlayerEventAdapter();
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
      this.playerEventAdapter.error(peerId, {
        message: "이미 입장하였습니다.",
      });

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
