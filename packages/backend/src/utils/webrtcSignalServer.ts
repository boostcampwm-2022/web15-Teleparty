import { Socket } from "socket.io";
import { SocketRouter } from "./socketMiddlware";

interface Player {
  id: string;
  userName: string;
  avataURL: string;
  isHost: boolean;
  isMicOn: boolean;
}
const router = new SocketRouter();
const players: Player[] = [];

router.get(
  "join",
  (
    socket: Socket,
    {
      userName,
      avata,
      roomId,
    }: {
      userName: string;
      avata: string;
      roomId: string | null;
    }
  ) => {
    roomId = roomId || "roomId";
    const player = {
      id: socket.id,
      userName,
      avataURL: avata,
      isHost: players.length === 0,
      isMicOn: false,
    };
    if (players.every((player) => player.id !== socket.id)) {
      players.push(player);
    }
    socket.join(roomId);

    socket.emit("join", { roomId, players });
    socket.broadcast.to(roomId).emit("player-join", player);
  }
);

export const WebRTCSignalRouter = router.router;
