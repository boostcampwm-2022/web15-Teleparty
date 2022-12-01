import { GarticphonePort } from "../inbound/garticphone.port";
import { GarticphoneRepository } from "../outbound/garticphone.repository";
import { GarticphoneRepositoryDataPort } from "../outbound/garitcphone.repository.port";
import { Garticphone } from "./garticphone";
import { GarticphoneEventPort } from "../outbound/garticphoneEvent.port";
import { GarticphoneEventAdapter } from "../outbound/garticphoneEvent.adapter";
import { GarticphoneToRoom } from "../outbound/garticphoneToRoom.port";
import { GarticphoneToRoomAdapter } from "../outbound/garticphoneToRoom.adapter";

export class GarticphoneService implements GarticphonePort {
  repository: GarticphoneRepositoryDataPort = new GarticphoneRepository();
  eventEmitter: GarticphoneEventPort = new GarticphoneEventAdapter();
  roomAPI: GarticphoneToRoom = new GarticphoneToRoomAdapter();

  startGame(roomId: string, roundTime: number, players: string[]) {
    const game = new Garticphone(players, roundTime, roomId);

    this.eventEmitter.gameStart(game.roomId, {
      gameMode: "Garticphone",
      totalRound: game.players.length,
      roundInfo: game.roundData,
    });

    const timerId = setTimeout(() => this.timeOut(roomId), roundTime);

    game.setTimer(timerId);
    this.repository.save(game);
  }

  sendAlbum(roomId: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    const player = game.nextPlayer();
    if (!player) return;
    console.log(player);
    const AlbumData = {
      peerId: player.id,
      isLast: game.isLastAlbum,
      result: player.getAlbum().map((data) => {
        return {
          peerId: data.ownerId,
          keyword: data.type === "keyword" ? data.data : null,
          img: data.type === "painting" ? data.data : null,
        };
      }),
    };

    this.eventEmitter.sendAlbum(roomId, AlbumData);

    this.repository.save(game);
  }

  timeOut(roomId: string) {
    this.eventEmitter.timeOut(roomId);
  }

  setAlbumData(roomId: string, playerId: string, data: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.setAlbumData(data, playerId);
    this.eventEmitter.keywordInput(roomId, playerId);

    if (game.isAllInputed) {
      clearTimeout(game.timerId);

      if (game.isGameEnded) {
        this.eventEmitter.gameEnd(roomId);
      } else {
        game.roundEnd();
        this.roundStart(game);
      }
    }

    this.repository.save(game);
  }

  roundStart(game: Garticphone) {
    const players = game.getPlayerList();
    const roundInfo = game.roundData;

    players.forEach((player) => {
      const target = game.getAlbumOwner(player.id, game.currentRound);
      if (!target) return;

      if (target.isExit) {
        this.setAlbumData(game.roomId, player.id, "");
      } else {
        const lastData = target.getLastAlbumData();
        const type = game.currentRoundType;
        const data = {
          keyword: type === "keyword" ? lastData : null,
          img: type === "painting" ? lastData : null,
          roundInfo,
        };

        this.eventEmitter.roundstart(player.id, type, data);
      }
    });

    const timerId = setTimeout(() => this.timeOut(game.roomId), game.roundTime);
    game.setTimer(timerId);

    this.repository.save(game);
  }

  cancelAlbumData(roomId: string, playerId: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.cancelAlbumData(playerId);
    this.eventEmitter.keywordCancel(roomId, playerId);

    this.repository.save(game);
  }

  exitGame(roomId: string, playerId: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    const result = game.exitGame(playerId);

    if (result) {
      this.eventEmitter.playerExit(game.roomId, playerId);
    }

    if (game.isAllExit) {
      this.roomAPI.gameEnded(game.roomId);
      this.repository.delete(game.roomId);
    } else {
      this.repository.save(game);
    }
  }
}
