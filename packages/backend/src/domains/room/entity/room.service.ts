import { RoomPort } from "../inbound/room.port";
import { RoomApiAdapter } from "../outbound/room.api.adapter";
import { RoomEventAdapter } from "../outbound/room.event.adapter";
import {
  RoomApiPort,
  RoomRepositoryDataPort,
  RoomEvent,
} from "../outbound/room.port";
import { RoomRepository } from "../outbound/room.repository";
import { Room } from "./room.entity";

export class RoomService implements RoomPort {
  roomRepository: RoomRepositoryDataPort;
  roomApiAdapter: RoomApiPort;
  roomEventEmitter: RoomEvent;

  constructor() {
    this.roomRepository = new RoomRepository();
    this.roomApiAdapter = new RoomApiAdapter();
  }

  join(peerId: string, roomId?: string) {
    const room = this.roomRepository.findOneByRoomId(roomId);
    const players = this.roomApiAdapter.getAllPlayer();

    if (!room) {
      const rooms = this.roomRepository.findAll();
      let newRoom: Room;

      if (rooms.length === 0) {
        newRoom = this.roomRepository.create("123123"); // 추후 uuid 같은 걸로 바꾸기
        newRoom.host = peerId;
      } else {
        newRoom = rooms[0];
        if (!newRoom.state) {
          // 입장 불가 상태 일 때
          return;
        }
      }

      newRoom.players.push(peerId);
      this.roomEventEmitter = new RoomEventAdapter(newRoom.roomId);

      this.roomEventEmitter.newJoin({
        roomId: newRoom.roomId,
        players: players.map((player) => {
          if (newRoom.players.includes(player.peerId)) {
            return {
              peerId: player.peerId,
              userName: player.userName,
              avataURL: player.avata,
              isHost: player.peerId === newRoom.host,
              isMicOn: player.isMicOn,
            };
          }
        }),
      });

      return;
    }

    if (!room.state) {
      // 입장 불가 상태 일 때
      return;
    }

    room.players.push(peerId);

    this.roomEventEmitter = new RoomEventAdapter(newRoom.roomId);

    this.roomEventEmitter.newJoin({
      roomId: room.roomId,
      players: players.map((player) => {
        if (room.players.includes(player.peerId)) {
          return {
            peerId: player.peerId,
            userName: player.userName,
            avataURL: player.avata,
            isHost: player.peerId === room.host,
            isMicOn: player.isMicOn,
          };
        }
      }),
    });

    return;
  }

  leave(peerId: string) {
    const room = this.roomRepository.findOneByPeerId(peerId);

    if (room?.host === peerId) {
      if (room?.players.length < 2) {
        this.roomRepository.deleteByRoomId(room.roomId);
        return;
      }

      this.roomRepository.updateHostByRoomId(room.roomId, room.players[1]);
    }

    this.roomRepository.deletePlayerofRoomByPeerId(peerId);

    const players = this.roomApiAdapter.getAllPlayer();

    console.log({
      roomId: room?.roomId,
      players: players.map((player) => {
        if (room?.players.includes(player.peerId)) {
          return {
            peerId: player.peerId,
            userName: player.userName,
            avataURL: player.avata,
            isHost: player.peerId === room?.host,
            isMicOn: player.isMicOn,
          };
        }
      }),
    });

    return;
  }
  gameStart(peerId: string, gameMode: string) {
    const room = this.checkHostByPeerId(peerId);
    if (room) {
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

      console.log({
        roomId: room.roomId,
        gameMode,
      });
      console.log(room);
    }

    return;
  }
  chooseMode(peerId: string, gameMode: string) {
    const room = this.checkHostByPeerId(peerId);
    if (room) {
      this.roomRepository.updateGameModeByRoomId(room.roomId, gameMode);

      // 방에 있는 모든 사람에게 게임 모드 알려주기
      console.log({
        roomId: room.roomId,
        gameMode,
      });
      console.log(room);
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
}
