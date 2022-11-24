import { Room } from "../entity/room.entity";
import { RoomRepository } from "./room.port";

export class RoomRepositoryImpl implements RoomRepository {
  private static rooms: Room[] = [];

  create(roomId: string) {
    const room = new Room(roomId);
    RoomRepositoryImpl.rooms.push(room);
    return room;
  }

  findOneByRoomId(roomId?: string) {
    const room = RoomRepositoryImpl.rooms.find(
      (room) => room.roomId === roomId
    );
    return room;
  }

  findOneByPeerId(peerId: string) {
    const room = RoomRepositoryImpl.rooms.find((room) => {
      return room.players.includes(peerId);
    });

    return room;
  }

  findAll() {
    return [...RoomRepositoryImpl.rooms];
  }

  updateHostByRoomId(roomId: string, peerId: string) {
    RoomRepositoryImpl.rooms = RoomRepositoryImpl.rooms.map((room) => {
      if (room.roomId === roomId) {
        room.host = peerId;
      }
      return room;
    });
  }

  updateStateByRoomId(roomId: string, state: boolean) {
    RoomRepositoryImpl.rooms = RoomRepositoryImpl.rooms.map((room) => {
      if (room.roomId === roomId) {
        room.state = state;
      }
      return room;
    });
  }

  updateGameModeByRoomId(roomId: string, gameMode: string) {
    RoomRepositoryImpl.rooms = RoomRepositoryImpl.rooms.map((room) => {
      if (room.roomId === roomId) {
        room.gameMode = gameMode;
      }
      return room;
    });
  }

  deleteByRoomId(roomId: string) {
    RoomRepositoryImpl.rooms = RoomRepositoryImpl.rooms.filter((room) => {
      room.roomId !== roomId;
    });
  }

  deletePlayerofRoomByPeerId(peerId: string) {
    RoomRepositoryImpl.rooms.forEach((room) => {
      room.players = room.players.filter((id) => {
        return id !== peerId;
      });
    });
  }
}
