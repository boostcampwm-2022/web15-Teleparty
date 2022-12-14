import { ChatOutPort } from "../useCases/chatOut.port";
import axios from "axios";

import { ADDRESS } from "../../../config/config";
import { errHandler } from "../../../utils/errorHandler";

const roomAxios = axios.create({
  baseURL: ADDRESS.room,
  timeout: 3000,
});

export class ChatPresenter implements ChatOutPort {
  @errHandler
  async broadcast(
    roomId: string,
    peerId: string,
    data: { message: string; id: string }
  ) {
    await roomAxios.post("chatting", { roomId, peerId, data });
  }
}
