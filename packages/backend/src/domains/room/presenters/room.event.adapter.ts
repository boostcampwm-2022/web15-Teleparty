import {
  GameMode,
  JoinPlayerTotalInfo,
  RoomEvent,
  PlayerInfo,
} from "./room.port";
import axios from "axios";
import { ADDRESS } from "../../../config/config";
import { errHandler } from "../../../utils/errorHandler";

const roomAxios = axios.create({
  baseURL: ADDRESS.room,
  timeout: 3000,
});

export class RoomEventAdapter implements RoomEvent {
  @errHandler
  async join(data: JoinPlayerTotalInfo, peerId: string) {
    // 나한테 보내기 socket.emit('join', data);
    await roomAxios.post("/join", { data, peerId });
  }

  @errHandler
  async newJoin(data: PlayerInfo, roomId: string) {
    // 원래 방에 있던 사람한테만 보내기(나 제외)
    await roomAxios.post("/new-join", { data, roomId });
  }

  @errHandler
  async modeChange(data: GameMode, roomId: string) {
    // 방에 있는 모든 사람에게 보내기
    await roomAxios.patch("/mode-change", { data, roomId });
  }

  @errHandler
  async quitPlayer(roomId: string, peerId: string) {
    await roomAxios.delete("/player-quit", {
      data: { roomId, data: { peerId } },
    });
  }

  @errHandler
  async sendError(peerId: string, message: string) {
    await roomAxios.post("/error", { peerId, data: { message } });
  }
}
