import { Player } from "./player.entitiy";
import { RoomPort } from "../inbound/room.port";
import { RoomApiAdapter } from "../outbound/room.api.adapter";
import { RoomEventAdapter } from "../outbound/room.event.adapter";
import {
  RoomApiPort,
  RoomRepositoryDataPort,
  RoomEvent,
} from "../outbound/room.port";
import { RoomRepository } from "../outbound/room.repository";
import { GAME_MODE, Room } from "./room.entity";
import { randomUUID } from "crypto";

export class RoomService implements RoomPort {
  roomRepository: RoomRepositoryDataPort;
  roomApiAdapter: RoomApiPort;
  roomEventEmitter: RoomEvent;

  constructor() {
    this.roomRepository = new RoomRepository();
    this.roomApiAdapter = new RoomApiAdapter();
    this.roomEventEmitter = new RoomEventAdapter();
  }

  async createPlayer(data: {
    peerId: string;
    userName: string;
    avata: string;
    roomId: string | null;
  }) {
    const { peerId, userName, avata, roomId } = data;

    let room: Room | undefined = undefined;

    if (roomId) {
      room = await this.roomRepository.findOneByRoomId(roomId);

      if (!room) {
        // 유효하지 않는 방 번호
        room = await this.createRoom();
      }

      if (room.players.length === room.maxPlayer) {
        // 가득 참
        return undefined;
      }

      if (!room.state) {
        // 게임중
        return undefined;
      }
    } else {
      room = await this.createRoom();
      console.log(room);
    }

    const player = this.roomRepository.createUser({
      peerId,
      userName,
      avata,
      roomId: room.roomId,
    });

    return player;
  }

  async createRoom() {
    const newRoomId = await this.createUUID();
    return this.roomRepository.create(newRoomId);
  }

  // roomId는 playerController에서 처리하기 때문에 무조건 넘어옴
  async join(player: Player) {
    const room = await this.roomRepository.findOneByRoomId(player.roomId);

    if (!room) {
      // 방이 없음 ?
      return;
    }

    room.players.push(player.peerId);

    if (!room.host) {
      // 내가 방에 처음 들어갔을 경우(내가 방을 만든 경우)
      room.host = player.peerId;
    } else {
      this.roomEventEmitter.newJoin(
        {
          peerId: player.peerId,
          userName: player.userName,
          avataURL: player.avata,
          isHost: player.peerId === room.host,
          isMicOn: player.isMicOn,
        },
        room.roomId
      );
    }

    const players = await this.roomRepository.findPlayersByPeerIds(
      room.players
    );

    if (!players) {
      // 방에 플레이어 정보 없음?
      return;
    }

    console.log(room.players);

    console.log(players);

    this.roomRepository.save(room.roomId, room);

    this.roomEventEmitter.join(
      {
        roomId: room.roomId,
        players: players.map((roomPlayer) => {
          return {
            peerId: roomPlayer.peerId,
            userName: roomPlayer.userName,
            avataURL: roomPlayer.avata,
            isHost: roomPlayer.peerId === room.host,
            isMicOn: roomPlayer.isMicOn,
          };
        }),
      },
      player.peerId
    );

    return;
  }

  async leave(peerId: string) {
    const player = await this.roomRepository.findPlayerByPeerId(peerId);
    if (!player) {
      return;
    }

    const room = await this.roomRepository.findOneByRoomId(player.roomId);
    if (!room) {
      return;
    }

    // 게임 하고 있을 때
    if (!room.state) {
      this.roomApiAdapter.playerQuit(room.gameMode, room.roomId, peerId);
    }

    // 나밖에 없을 때
    if (room.players.length === 1) {
      this.roomRepository.deleteByRoomId(room.roomId);
      return;
    }

    // 내가 방장일 때
    if (room.host === player.peerId) {
      const newHost = room.players.find((peerId) => {
        peerId !== room.host;
      });

      // 내가 방장인데 나밖에 없을 때? -> 위에서 걸러지긴 하는데..
      if (!newHost) {
        return;
      }

      this.roomRepository.updateHostByRoomId(room.roomId, newHost);
    }

    this.roomRepository.deletePlayer(peerId, room);

    this.roomEventEmitter.quitPlayer(room.roomId, peerId);

    return;
  }
  async gameStart(peerId: string, gameMode: GAME_MODE) {
    const room = await this.checkHostByPeerId(peerId);

    if (!room) {
      return;
    }

    if (room.state) {
      room.gameMode = gameMode;
      room.state = false;

      this.roomRepository.save(room.roomId, room);

      // this.roomRepository.updateGameModeByRoomId(room.roomId, gameMode);

      // // 게임이 시작하면 못들어오게 막기
      // this.roomRepository.updateStateByRoomId(room.roomId, false);

      // 게임시작 신호 보내기(game한테)
      this.roomApiAdapter.gameStart(
        room.roomId,
        gameMode,
        room.players,
        room.totalRound,
        room.roundTime,
        room.goalScore
      );
    }

    return;
  }
  async chooseMode(peerId: string, gameMode: GAME_MODE) {
    const room = await this.checkHostByPeerId(peerId);
    if (room) {
      this.roomRepository.updateGameModeByRoomId(room.roomId, gameMode);

      // 방에 있는 모든 사람에게 게임 모드 알려주기
      this.roomEventEmitter.modeChange(
        {
          roomId: room.roomId,
          gameMode: gameMode,
        },
        room.roomId
      );
    }
    return;
  }

  async checkHostByPeerId(peerId: string) {
    const player = await this.roomRepository.findPlayerByPeerId(peerId);
    if (!player) {
      return undefined;
    }

    const room = await this.roomRepository.findOneByRoomId(player.roomId);

    if (room) {
      if (room.host === peerId) {
        // 호스트만 가능
        return room;
      }
    }
    console.log("방 없거나 권한 없음");

    return undefined;
  }

  async chatting(peerId: string, message: string) {
    const room = await this.roomRepository.findOneByPeerId(peerId);
    console.log("채팅하는 방", room);

    if (room) {
      this.roomApiAdapter.chatting(peerId, room.roomId, message);
    }

    return;
  }

  checkPlayer(peerId: string) {
    const allPlayer = this.roomRepository.findAllPlayer();
    if (allPlayer.includes(peerId)) {
      return true;
    }

    return false;
  }

  async createUUID() {
    let uuid = randomUUID();

    while (await this.roomRepository.findOneByRoomId(uuid)) {
      uuid = randomUUID();
      console.log("uuid 무한");
    }

    return uuid;
  }

  async endGame(roomId: string) {
    const room = await this.roomRepository.findOneByRoomId(roomId);
    if (room) {
      this.roomRepository.updateStateByRoomId(room.roomId, true);
    }
    return;
  }
}
