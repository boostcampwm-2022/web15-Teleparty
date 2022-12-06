import { GAME_MODE, Room } from "../entity/room.entity";
import { RoomRepositoryDataPort } from "./room.port";

export class RoomRepository implements RoomRepositoryDataPort {
  private static rooms: Room[] = [];

  create(roomId: string) {
    const room = new Room(roomId);
    console.log(RoomRepository.rooms.map((room) => room.roomId));
    RoomRepository.rooms.push(room);
    return room;
  }

  savePlayers(roomId: string, players: string[]) {
    RoomRepository.rooms.forEach((room) => {
      if (room.roomId === roomId) {
        room.players = players;
      }
    });
  }

  findOneByRoomId(roomId?: string) {
    const room = RoomRepository.rooms.find((room) => room.roomId === roomId);
    return room;
  }

  findOneByPeerId(peerId: string) {
    const room = RoomRepository.rooms.find((room) => {
      return room.players.includes(peerId);
    });

    return room;
  }

  findAll() {
    return [...RoomRepository.rooms];
  }

  updateHostByRoomId(roomId: string, peerId: string) {
    RoomRepository.rooms.forEach((room) => {
      if (room.roomId === roomId) {
        room.host = peerId;
      }
      return room;
    });
  }

  updateStateByRoomId(roomId: string, state: boolean) {
    RoomRepository.rooms.forEach((room) => {
      if (room.roomId === roomId) {
        room.state = state;
      }
      return room;
    });
  }

  updateGameModeByRoomId(roomId: string, gameMode: GAME_MODE) {
    RoomRepository.rooms.forEach((room) => {
      if (room.roomId === roomId) {
        room.gameMode = gameMode;
      }
      return room;
    });
  }

  deleteByRoomId(roomId: string) {
    console.log("delete roomId", roomId);
    console.log(RoomRepository.rooms.map((room) => room.roomId));

    RoomRepository.rooms = RoomRepository.rooms.filter(
      (room) => room.roomId !== roomId
    );
    console.log(RoomRepository.rooms.map((room) => room.roomId));
  }

  deletePlayerofRoomByPeerId(peerId: string) {
    RoomRepository.rooms.forEach((room) => {
      room.players = room.players.filter((id) => {
        return id !== peerId;
      });
    });
  }
}
