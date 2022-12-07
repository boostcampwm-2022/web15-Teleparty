import { PlayerPort } from "../inbound/player.port";
import {
  PlayerApiPort,
  PlayerEvent,
  PlayerRepositoryDataPort,
} from "../outbound/player.port";
import { PlayerApiAdapter } from "../outbound/player.api.adapter";
import { PlayerRepository } from "../outbound/player.repository";
import { PlayerEventAdapter } from "../outbound/player.event.adapter";
import { Socket } from "socket.io";

export class PlayerService implements PlayerPort {
  playerApiAdapter: PlayerApiPort;
  playerRepository: PlayerRepositoryDataPort;
  playerEventAdapter: PlayerEvent;

  constructor() {
    this.playerApiAdapter = new PlayerApiAdapter();
    this.playerRepository = new PlayerRepository();
    this.playerEventAdapter = new PlayerEventAdapter();
  }

  async createPlayer(
    socket: Socket,
    peerId: string,
    userName: string,
    avata: string,
    roomId: string
  ) {
    const checkPlayer = await this.playerRepository.findOneByPeerId(peerId);

    // 중복 입장 체크
    if (checkPlayer) {
      this.sendError(peerId, "이미 입장하였습니다.");
      return;
    }

    // socket room 입장 처리
    socket.join(roomId);

    const player = this.playerRepository.create(peerId, userName, avata);
    console.log("palyer.service, 새로 들어온 플레이어", player.peerId);

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

  async getAllPlayer() {
    return await this.playerRepository.findAll();
  }

  sendError(peerId: string, message: string) {
    this.playerEventAdapter.error(peerId, {
      message: message,
    });
  }
}
