import { off } from "process";
import { Socket } from "socket.io";

export class Player {
  socket: Socket;
  userName: string;
  score: number;

  constructor(socket: Socket, userName: string) {
    this.socket = socket;
    this.userName = userName;
    this.score = 0;
  }

  pulsScore(score: number) {
    this.score += score;
  }

  on(event: string, callback: (data: any) => void) {
    // 나중에 undefined
    this.socket.on(event, callback);
  }

  off(event: string, callback: (data: any) => void) {
    // 나중에 undefined
    this.socket.off(event, callback);
  }

  joinRoom(roomId: string) {
    this.socket.join(roomId);
  }

  get id(): string {
    return this.socket.id;
  }
}
