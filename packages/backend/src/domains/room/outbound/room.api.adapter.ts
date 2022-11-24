import { RoomApiPort } from "./room.port";

export class RoomApiAdapter implements RoomApiPort {
  gameStart(roomId: string, gameMode: string) {
    // game controller gameStart 보냄
    console.log(roomId, gameMode, "gameStart");

    return;
  }
}
