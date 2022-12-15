import { ClientAPIPort } from "../useCases/ports/clientAPI.port";
import { Player } from "../entity/player";
import {
  CatchMindInfo,
  RoundEndData,
  StartGameData,
} from "../../../types/catchMind.type";
import { errHandler } from "../../../utils/errorHandler";
import axios from "axios";
import { ADDRESS } from "../../../config/config";

const catchMindAxios = axios.create({
  baseURL: ADDRESS.catchMind,
  timeout: 3000,
});

export class ClientAPIPresenter implements ClientAPIPort {
  // @errHandler
  async gameStart(roomId: string, data: StartGameData) {
    await catchMindAxios.post("/game-start", {
      roomId,
      data: {
        gameMode: "CatchMind",
        ...data,
      },
    });
  }

  // @errHandler
  async drawStart(roomId: string, { id }: Player) {
    await catchMindAxios.post("/draw-start", {
      roomId,
      data: { turnPlayer: id },
    });
  }

  // @errHandler
  async roundEnd(roomId: string, data: RoundEndData) {
    await catchMindAxios.post("/round-end", { roomId, data });
  }

  // @errHandler
  async roundReady(roomId: string, id: string) {
    await catchMindAxios.post("/round-ready", { roomId, data: { peerId: id } });
  }

  // @errHandler
  async roundStart(roomId: string, data: CatchMindInfo) {
    await catchMindAxios.post("/round-start", { roomId, data });
  }

  // @errHandler
  async playerExit(roomId: string, playerId: string) {
    await catchMindAxios.delete("/quit-game", {
      data: {
        roomId,
        data: { peerId: playerId },
      },
    });
  }
}
