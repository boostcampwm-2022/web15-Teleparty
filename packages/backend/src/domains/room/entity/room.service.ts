import { Player } from "../../player/entity/player.entitiy";
import { RoomPort } from "../inbound/room.port";
import { RoomApiAdapter } from "../outbound/room.api.adapter";
import { RoomEventAdapter } from "../outbound/room.event.adapter";
import {
  RoomApiPort,
  RoomRepositoryDataPort,
  RoomEvent,
  PlayerInfo,
} from "../outbound/room.port";
import { RoomRepository } from "../outbound/room.repository";
import { Room, GAME_MODE } from "./room.entity";

export class RoomService implements RoomPort {
  roomRepository: RoomRepositoryDataPort;
  roomApiAdapter: RoomApiPort;
  roomEventEmitter: RoomEvent;

  constructor() {
    this.roomRepository = new RoomRepository();
    this.roomApiAdapter = new RoomApiAdapter();
    this.roomEventEmitter = new RoomEventAdapter();
  }

  // roomId는 playerController에서 처리하기 때문에 무조건 넘어옴
  join(peerId: string, roomId: string) {
    const room = this.roomRepository.findOneByRoomId(roomId);
    const players = this.roomApiAdapter.getAllPlayer();

    // 생성된 방이 없는 경우
    if (!room) {
      const newRoom = this.roomRepository.create(roomId);
      console.log("room.service newRoom", newRoom.roomId);

      newRoom.host = peerId;

      newRoom.players.push(peerId);

      this.roomEventEmitter.join(
        {
          roomId: newRoom.roomId,
          players: newRoom.players.map((peerId) => {
            const player = players.find(
              (player) => player.peerId === peerId
            ) as Player;

            return {
              peerId: player.peerId,
              userName: player.userName,
              avataURL: player.avata,
              isHost: player.peerId === newRoom.host,
              isMicOn: player.isMicOn,
            };
          }),
        },
        peerId
      );

      console.log(
        "room.service 새로운방 생성 완료",
        this.roomRepository.findOneByRoomId(roomId)?.roomId
      );

      this.roomRepository.savePlayers(newRoom.roomId, newRoom.players);

      return;
    }

    room.players.push(peerId);

    console.log("room.service oldRoom", room.roomId);
    this.roomEventEmitter.join(
      {
        roomId: room.roomId,
        players: room.players.map((peerId) => {
          const player = players.find(
            (player) => player.peerId === peerId
          ) as Player;

          return {
            peerId: player.peerId,
            userName: player.userName,
            avataURL: player.avata,
            isHost: player.peerId === room.host,
            isMicOn: player.isMicOn,
          };
        }),
      },
      peerId
    );

    const playerInfo = players.find((player) => player.peerId === peerId);

    if (playerInfo) {
      this.roomEventEmitter.newJoin(
        {
          peerId: playerInfo.peerId,
          userName: playerInfo.userName,
          avataURL: playerInfo.avata,
          isHost: playerInfo.peerId === room.host,
          isMicOn: playerInfo.isMicOn,
        },
        room.roomId
      );
    }

    this.roomRepository.savePlayers(room.roomId, room.players);

    return;
  }

  leave(peerId: string) {
    const room = this.roomRepository.findOneByPeerId(peerId);

    if (!room) {
      return;
    }
    console.log("room.service leaveRoom", room.roomId, peerId);

    if (room && !room.state) {
      this.roomApiAdapter.playerQuit(room.gameMode, room.roomId, peerId);
    }

    if (room.players.length === 1) {
      console.log("플레이어 정보", room.players);

      console.log("room.service 방삭제", room.roomId);
      this.roomRepository.deleteByRoomId(room.roomId);
      return;
    }

    if (room.host === peerId) {
      const newHostPlayer = room.players.find((id) => id !== peerId) as string;

      this.roomRepository.updateHostByRoomId(room.roomId, newHostPlayer);
    }

    this.roomRepository.deletePlayerofRoomByPeerId(peerId);

    this.roomEventEmitter.quitPlayer({ peerId }, room.roomId);

    return;
  }
  gameStart(peerId: string, gameMode: GAME_MODE) {
    const room = this.checkHostByPeerId(peerId);
    if (room && room.state) {
      this.roomRepository.updateGameModeByRoomId(room.roomId, gameMode);

      // 게임이 시작하면 못들어오게 막기
      this.roomRepository.updateStateByRoomId(room.roomId, false);

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
  chooseMode(peerId: string, gameMode: GAME_MODE) {
    const room = this.checkHostByPeerId(peerId);
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

  checkHostByPeerId(peerId: string) {
    const room = this.roomRepository.findOneByPeerId(peerId);

    if (room) {
      if (room.host === peerId) {
        // 호스트만 가능
        return room;
      }
    }
    console.log("방 없거나 권한 없음");

    return undefined;
  }

  chatting(peerId: string, message: string) {
    const room = this.roomRepository.findOneByPeerId(peerId);

    if (room) {
      this.roomApiAdapter.chatting(peerId, room.roomId, message);
    }

    return;
  }

  endGame(roomId: string) {
    const room = this.roomRepository.findOneByRoomId(roomId);
    if (room) {
      this.roomRepository.updateStateByRoomId(room.roomId, true);
    }
    return;
  }
}
