import { Player } from "../entity/player.entitiy";
import { RoomPort } from "../controllers/room.port";
import { RoomApiAdapter } from "../presenters/room.api.adapter";
import { RoomEventAdapter } from "../presenters/room.event.adapter";
import {
  RoomApiPort,
  RoomRepositoryDataPort,
  RoomEvent,
} from "../presenters/room.port";
import { RoomRepository } from "../presenters/room.repository";
import { Room } from "../entity/room.entity";
import { randomUUID } from "crypto";
import { GAME_MODE } from "../../../types/room";

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
        room = await this.createRoom(roomId);
      }
      this.roomRepository.release(roomId);

      if (room.checkMaxPlayer()) {
        // 가득 참
        this.sendError(peerId, "이미 방이 가득 찼습니다.");
        return;
      }

      if (!room.state) {
        // 게임중
        this.sendError(peerId, "이미 게임이 시작한 방입니다.");
        return;
      }
    } else {
      room = await this.createRoom();
    }

    const player = this.roomRepository.createUser({
      peerId,
      userName,
      avata,
      roomId: room.roomId,
    });

    return player;
  }

  async createRoom(roomId?: string | null) {
    const newRoomId = roomId || (await this.createUUID());
    return this.roomRepository.create(newRoomId);
  }

  // roomId는 playerController에서 처리하기 때문에 무조건 넘어옴
  async join(player: Player) {
    const room = await this.roomRepository.findOneByRoomId(player.roomId);

    if (!room) {
      // 방이 없음 ?
      this.sendError(player.peerId, "join Error, 해당하는 방을 못 찾음");
      return;
    }

    room.addPlayer(player);

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

    console.log("join", room.roomId, player.peerId, room.players.length);
    this.roomRepository.save(room.roomId, room);

    this.roomEventEmitter.join(
      {
        roomId: room.roomId,
        players: room.players.map((roomPlayer) => {
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

    this.roomRepository.release(room.roomId);
    return;
  }

  async leave(peerId: string) {
    const player = await this.roomRepository.findPlayerByPeerId(peerId);
    if (!player) {
      this.sendError(peerId, "leave Error, 플레이어 정보 없음");
      return;
    }

    const room = await this.roomRepository.findOneByRoomId(player.roomId);
    this.roomRepository.release(player.roomId);
    if (!room) {
      this.sendError(peerId, "leave Error, 방 정보 없음");
      return;
    }

    // 게임 하고 있을 때
    if (!room.state) {
      this.roomApiAdapter.playerQuit(room.gameMode, room.roomId, peerId);
    }

    // 나밖에 없을 때
    if (room.players.length === 1) {
      this.roomRepository.deleteByRoomId(room.roomId);
      console.log("나밖에 없어서 방 삭제");
      return;
    }

    room.leavePlayer(player.peerId);

    // 여전히 나간 사람이 방장일 때
    if (room.host === player.peerId) {
      this.sendError(peerId, "방장변경에러, 방장 변경안됨");
      return;
    }

    this.roomRepository.deletePlayer(peerId, room);

    this.roomEventEmitter.quitPlayer(room.roomId, peerId);
    return;
  }
  async gameStart(peerId: string, gameMode: GAME_MODE) {
    const room = await this.checkHostByPeerId(peerId);

    if (!room) {
      this.sendError(peerId, "game-start Error, 해당하는 방이 없음");
      return;
    }

    if (room.state) {
      room.changeGameMode(gameMode);
      room.changeState(false);

      this.roomRepository.save(room.roomId, room);
      this.roomRepository.release(room.roomId);

      const playerIds = room.getPlayerId();

      // 게임시작 신호 보내기(game한테)
      this.roomApiAdapter.gameStart(
        room.roomId,
        gameMode,
        playerIds,
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
      room.changeGameMode(gameMode);
      this.roomRepository.save(room.roomId, room);

      // 방에 있는 모든 사람에게 게임 모드 알려주기
      this.roomEventEmitter.modeChange(
        {
          roomId: room.roomId,
          gameMode: gameMode,
        },
        room.roomId
      );
      this.roomRepository.release(room.roomId);
    }

    return;
  }

  async checkHostByPeerId(peerId: string) {
    const player = await this.roomRepository.findPlayerByPeerId(peerId);
    if (!player) {
      this.sendError(peerId, "방장체크 중 Error, 플레이어 정보 없음");
      return;
    }

    const room = await this.roomRepository.findOneByRoomId(player.roomId);

    if (room) {
      if (room.checkHost(peerId)) {
        // 호스트만 가능
        return room;
      }
    }
    // console.log("방 없거나 권한 없음");
    this.sendError(peerId, "방장체크 중 Error, 방장 아님");

    this.roomRepository.release(player.roomId);
    return;
  }

  async chatting(peerId: string, message: string) {
    const room = await this.roomRepository.findOneByPeerId(peerId);

    if (!room) {
      this.sendError(peerId, "chatting Error, 방 없음");
      return;
    }

    this.roomApiAdapter.chatting(peerId, room.roomId, message);
    this.roomRepository.release(room.roomId);
    return;
  }

  checkPlayer(peerId: string) {
    const allPlayer = this.roomRepository.findAllPlayer();
    if (allPlayer.includes(peerId)) {
      this.sendError(peerId, "중복 입장 체크 Error, 이미 접속한 상태");
      return true;
    }

    return false;
  }

  sendError(peerId: string, message: string) {
    this.roomEventEmitter.sendError(peerId, message);
  }

  async createUUID() {
    const uuid = randomUUID();

    return uuid;
  }

  async endGame(roomId: string) {
    const room = await this.roomRepository.findOneByRoomId(roomId);
    if (room) {
      room.changeState(true);
      this.roomRepository.save(room.roomId, room);
    }
    this.roomRepository.release(roomId);
    return;
  }
}
