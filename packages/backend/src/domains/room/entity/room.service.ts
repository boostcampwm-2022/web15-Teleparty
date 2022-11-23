import { PlayerRepository } from "../../player/outbound/player.port";
import { PlayerRepositoryImpl } from "../../player/outbound/player.repositoryImpl";
import { RoomPort } from "../inbound/room.port";
import { RoomRepository } from "../outbound/room.port";
import { RoomRepositoryImpl } from "../outbound/room.repositoryImpl";
import { Room } from "./room.entity";

export class RoomService implements RoomPort {
  roomRepository: RoomRepository;
  playerRepository: PlayerRepository;

  constructor() {
    this.roomRepository = new RoomRepositoryImpl();
    this.playerRepository = new PlayerRepositoryImpl();
  }

  join(peerId: string, roomId?: string) {
    const room = this.roomRepository.findOneByRoomId(roomId);
    const players = this.playerRepository.findAll();

    if (!room) {
      const rooms = this.roomRepository.findAll();
      let newRoom: Room;

      if (rooms.length === 0) {
        newRoom = this.roomRepository.create("123123");
        newRoom.host = peerId;
      } else {
        newRoom = rooms[0];
      }

      newRoom.players.push(peerId);

      console.log({
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

    room.players.push(peerId);

    console.log({
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

      this.roomRepository.updateRoomHostByRoomId(room.roomId, room.players[1]);
    }

    this.roomRepository.deletePlayerofRoomByPeerId(peerId);

    const players = this.playerRepository.findAll();

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
  gameStart() {
    return;
  }
  chooseMode() {
    return;
  }
}
