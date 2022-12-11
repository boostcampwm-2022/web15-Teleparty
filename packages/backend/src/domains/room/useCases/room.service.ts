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
import { GAME_MODE, Room } from "../entity/room.entity";
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
        this.sendError(peerId, "이미 방이 가득 찼습니다.");
        return undefined;
      }

      if (!room.state) {
        // 게임중
        this.sendError(peerId, "이미 게임이 시작한 방입니다.");
        return undefined;
      }
    } else {
      room = await this.createRoom();
      // console.log(room);
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
      this.sendError(player.peerId, "join Error, 해당하는 방을 못 찾음");
      return;
    }

    room.players.push(player);

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

    // console.log(room.players);

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

    return;
  }

  async leave(peerId: string) {
    const player = await this.roomRepository.findPlayerByPeerId(peerId);
    if (!player) {
      this.sendError(peerId, "leave Error, 플레이어 정보 없음");
      return;
    }

    const room = await this.roomRepository.findOneByRoomId(player.roomId);
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
      // console.log("나밖에 없어서 방 삭제");
      return;
    }

    // 내가 방장일 때
    if (room.host === player.peerId) {
      const newHost = room.players.find((player) => {
        return player.peerId !== room.host;
      });

      // console.log("새로운방장", newHost);

      // 내가 방장인데 나밖에 없을 때? -> 위에서 걸러지긴 하는데..
      if (!newHost) {
        this.sendError(peerId, "leave Error, 방에 혼자 있는데 방장임");
        return;
      }

      room.host = newHost.peerId;
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
      room.gameMode = gameMode;
      room.state = false;

      this.roomRepository.save(room.roomId, room);

      const playerIds = room.players.map((player) => player.peerId);

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
      room.gameMode = gameMode;
      this.roomRepository.save(room.roomId, room);

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
      this.sendError(peerId, "방장체크 중 Error, 플레이어 정보 없음");
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
    this.sendError(peerId, "방장체크 중 Error, 방장 아님");

    return undefined;
  }

  async chatting(peerId: string, message: string) {
    const room = await this.roomRepository.findOneByPeerId(peerId);
    console.log("채팅하는 방", room);

    if (!room) {
      this.sendError(peerId, "chatting Error, 방 없음");
      return;
    }

    this.roomApiAdapter.chatting(peerId, room.roomId, message);

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
    let uuid = randomUUID();

    while (await this.roomRepository.findOneByRoomId(uuid)) {
      uuid = randomUUID();
      // console.log("uuid 무한");
    }

    return uuid;
  }

  async endGame(roomId: string) {
    const room = await this.roomRepository.findOneByRoomId(roomId);
    if (room) {
      room.state = true;
      this.roomRepository.save(room.roomId, room);
    }
    return;
  }
}
