import { SocketEmitter } from "../../../utils/socketEmitter";
import { JoinPlayerTotalInfo, RoomEvent } from "./room.port";

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
}
