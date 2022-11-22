import { Socket } from "socket.io";
import { io as socketServer } from "../../app";
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
        socketServer.to(room.roomId).emit(
          "join",
          room.players.map((player: Player) => {
            return {
              userName: player.userName,
              userId: player.socket.id,
              avata: player.avata,
              score: player.score,
            };
          })
        );

        return;
      }
    }

    const room = new Room("123123");
    room.join(player);
    rooms.push(room);

    socketServer.to(room.roomId).emit(
      "join",
      room.players.map((player: Player) => {
        return {
          userName: player.userName,
          userId: player.socket.id,
          avata: player.avata,
          score: player.score,
        };
      })
    );
  });
};
