import { Server } from "socket.io";

export class SocketEmitter {
  static server: Server;

  broadcastRoom(roomId: string, event: string, data: any) {
    SocketEmitter.server.to(roomId).emit(event, data);
  }

  static setServer(server: Server) {
    this.server = server;
  }
}
