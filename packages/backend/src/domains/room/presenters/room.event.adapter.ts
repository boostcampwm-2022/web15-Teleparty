import { GameMode, JoinPlayerTotalInfo, PlayerInfo } from "../../../types/room";
import { SocketEmitter } from "../../../utils/socketEmitter";
import { RoomEvent } from "./room.port";

export class RoomEventAdapter implements RoomEvent {
  emitter: SocketEmitter;

  constructor() {
    this.emitter = new SocketEmitter();
  }

  join(data: JoinPlayerTotalInfo, peerId: string) {
    // 나한테 보내기 socket.emit('join', data);
    this.emitter.emit(peerId, "join", data);

    return;
  }

  newJoin(data: PlayerInfo, roomId: string) {
    // 원래 방에 있던 사람한테만 보내기(나 제외)
    this.emitter.broadcastRoomNotMe(roomId, data.peerId, "new-join", data);
    return;
  }

  modeChange(data: GameMode, roomId: string) {
    // 방에 있는 모든 사람에게 보내기
    this.emitter.broadcastRoom(roomId, "mode-change", data);
    // socket.emit('mode-change', data);
  }

  quitPlayer(roomId: string, peerId: string) {
    this.emitter.broadcastRoom(roomId, "player-quit", { peerId });
  }

  sendError(peerId: string, message: string) {
    this.emitter.emit(peerId, "error", {
      message,
    });
  }
}
