import { Server, Socket } from "socket.io";
import { SocketRouter } from "./socketMiddlware";

interface Player {
  peerId: string;
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
      peerId: socket.id,
      userName,
      avataURL: avata,
      isHost: players.length === 0,
      isMicOn: false,
    };
    if (players.every((player) => player.peerId !== socket.id)) {
      players.push(player);
    }
    socket.join(roomId);

    socket.emit("join", { roomId, players });
    socket.broadcast.to(roomId).emit("new-joinplayer", player);
  }
);

export const WebRTCSignalRouter = router.router;
