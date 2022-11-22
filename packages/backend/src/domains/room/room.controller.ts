import { Socket } from "socket.io";
import { Player } from "../player/player";
import { Room } from "./room.model";

const rooms: Room[] = []; // 나중에 redis에서 관리 하도록 변경

export const roomController = (socket: Socket) => {
  socket.on("join", (data: { userName: string; roomId: string }) => {
    const player = new Player(socket, data.userName);

    if (data.roomId) {
      const room = rooms.find((room: Room) => {
        return room.roomId === data.roomId;
      });

      if (room) {
        room.join(player);
        return;
      }
    }

    const room = new Room("123123");
    room.join(player);
    rooms.push(room);
  });
};
