import { PlayerPort } from "../inbound/player.port";
import { PlayerApiPort, PlayerRepository } from "../outbound/player.port";
import { PlayerApiAdapter } from "../outbound/player.api.adapter";
import { PlayerRepositoryImpl } from "../outbound/player.repositoryImpl";

export class PlayerService implements PlayerPort {
  playerApiAdapter: PlayerApiPort;
  playerRepository: PlayerRepository;

  constructor() {
    this.playerApiAdapter = new PlayerApiAdapter();
    this.playerRepository = new PlayerRepositoryImpl();
  }

  createPlayer(
    peerId: string,
    userName: string,
    avata: string,
    roomId: string
  ) {
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
}
