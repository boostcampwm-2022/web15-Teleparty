import { Server, Socket } from "socket.io";

export class SocketEmitter {
  static server: Server;
  static sockets: Socket[];

  broadcastRoom(roomId: string, event: string, data?: unknown) {
    SocketEmitter.server.to(roomId).emit(event, data);
  }

  broadcastRoomNotMe(
    roomId: string,
    peerId: string,
    event: string,
    data: unknown
  ) {
    const socket = SocketEmitter.server.sockets.sockets.get(peerId);
    socket?.broadcast.to(roomId).emit(event, data);
  }

  emit(socketId: string, event: string, data: unknown) {
    SocketEmitter.server.to(socketId).emit(event, data);
  }

  static setServer(server: Server) {
    this.server = server;
  }
}
