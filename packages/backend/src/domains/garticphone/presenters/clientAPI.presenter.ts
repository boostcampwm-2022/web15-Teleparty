import {
  ClientAPIPort,
  GarticStartData,
  GarticAlbum,
  GarticRoundData,
} from "../useCases/ports/clientAPI.port";
import { RoundType } from "../useCases/ports/garticphoneController.port";
import { errHandler } from "../../../utils/errorHandler";
import axios from "axios";
import { ADDRESS } from "../../../config/config";

const EVENT_NAME = { painting: "draw-start", keyword: "keyword-input-start" };
const garticAxios = axios.create({
  baseURL: ADDRESS.gartic,
  timeout: 3000,
});

const parsePlayerId = (roomId: string, playerId: string) => {
  return { roomId, data: { peerId: playerId } };
};

export class ClientAPIPresenter implements ClientAPIPort {
  @errHandler
  async gameStart(roomId: string, data: GarticStartData) {
    await garticAxios.post("/game-start", { roomId, data });
  }

  @errHandler
  async keywordInput(roomId: string, playerId: string) {
    await garticAxios.post("/input-keyword", parsePlayerId(roomId, playerId));
  }

  @errHandler
  async keywordCancel(roomId: string, playerId: string) {
    await garticAxios.patch("/keyword-cancel", parsePlayerId(roomId, playerId));
  }

  @errHandler
  async drawInput(roomId: string, playerId: string) {
    await garticAxios.post("/draw-input", parsePlayerId(roomId, playerId));
  }

  @errHandler
  async drawCancel(roomId: string, playerId: string) {
    await garticAxios.patch("/draw-cancel", parsePlayerId(roomId, playerId));
  }

  @errHandler
  async timeOut(roomId: string) {
    await garticAxios.post("/time-out", { roomId });
  }

  @errHandler
  async roundstart(
    playerId: string,
    roundType: RoundType,
    data: GarticRoundData
  ) {
    await garticAxios.post(EVENT_NAME[roundType], { playerId, data });
  }

  @errHandler
  async gameEnd(roomId: string) {
    await garticAxios.post("/game-end", { roomId });
  }

  @errHandler
  async sendAlbum(roomId: string, data: GarticAlbum) {
    await garticAxios.post("/album", { roomId, data });
  }

  @errHandler
  async playerExit(roomId: string, playerId: string) {
    await garticAxios.delete("/quit-game", {
      data: parsePlayerId(roomId, playerId),
    });
  }
}
