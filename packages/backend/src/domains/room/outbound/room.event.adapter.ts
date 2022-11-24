import { SocketEmitter } from "../../../utils/socketEmitter";
import { GameMode, JoinPlayerTotalInfo, RoomEvent } from "./room.port";

export class RoomEventAdapter implements RoomEvent {
  roomId: string;
  emitter: SocketEmitter;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.emitter = new SocketEmitter();
  }

  join(data: JoinPlayerTotalInfo) {
    // 나한테 보내기 socket.emit('join', data);
    return;
  }

  newJoin(data: JoinPlayerTotalInfo) {
    // 원래 방에 있던 사람한테만 보내기(나 제외)
    this.emitter.broadcastRoom(this.roomId, "new-join", data);
    return;
  }

  modeChange(data: GameMode) {
    // 방에 있는 모든 사람에게 보내기
    this.emitter.broadcastRoom(this.roomId, "mode-change", data);
    // socket.emit('mode-change', data);
  }
}
