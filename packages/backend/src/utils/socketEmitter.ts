import { Server, Socket } from "socket.io";

export class SocketEmitter {
  static server: Server;
  static sockets: Socket[];

  broadcastRoom(roomId: string, event: string, data: unknown) {
    SocketEmitter.server.to(roomId).emit(event, data);
  }

  static setServer(server: Server) {
    this.server = server;
  }
}
