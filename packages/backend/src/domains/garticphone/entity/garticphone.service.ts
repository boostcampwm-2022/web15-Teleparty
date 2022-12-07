import { GarticphonePort, RoundType } from "../inbound/garticphone.port";
import { GarticphoneRepository } from "../outbound/garticphone.repository";
import { GarticphoneRepositoryDataPort } from "../outbound/garitcphone.repository.port";
import { Garticphone, Timer } from "./garticphone";
import { GarticphoneEventPort } from "../outbound/garticphoneEvent.port";
import { GarticphoneEventAdapter } from "../outbound/garticphoneEvent.adapter";
import { GarticphoneToRoom } from "../outbound/garticphoneToRoom.port";
import { GarticphoneToRoomAdapter } from "../outbound/garticphoneToRoom.adapter";
import { TimerRepository } from "../outbound/timer.repository";
import { TimerRepositoryDataPort } from "../outbound/timer.repository.port";

const MSEC_PER_SEC = 1000;
export class GarticphoneService implements GarticphonePort {
  gameRepository: GarticphoneRepositoryDataPort = new GarticphoneRepository();
  timerRepository: TimerRepositoryDataPort = new TimerRepository();
  eventEmitter: GarticphoneEventPort = new GarticphoneEventAdapter();
  roomAPI: GarticphoneToRoom = new GarticphoneToRoomAdapter();

  startGame(roomId: string, roundTime: number, players: string[]) {
    const game = new Garticphone(players, roundTime, roomId);

    this.eventEmitter.gameStart(game.roomId, {
      gameMode: "Garticphone",
      totalRound: game.players.length,
      roundInfo: game.roundData,
    });

    const timerId = setTimeout(
      () => this.timeOut(roomId),
      game.roundTime * MSEC_PER_SEC
    );

    this.timerRepository.save(roomId, new Timer(roomId, timerId));

    this.gameRepository.save(game);
  }

  sendAlbum(roomId: string, playerId: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game || !game.isHost(playerId)) return;

    const player = game.nextPlayer();
    console.log("send album", playerId);
    if (!player) return;

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

    this.gameRepository.save(game);
  }

  timeOut(roomId: string) {
    this.eventEmitter.timeOut(roomId);
  }

  setAlbumData(
    roomId: string,
    playerId: string,
    data: string,
    type: RoundType
  ) {
    const game = this.gameRepository.findById(roomId);
    if (!game || game.currentRoundType !== type) return;

    game.setAlbumData(data, playerId);

    if (game.currentRoundType === "keyword") {
      this.eventEmitter.keywordInput(roomId, playerId);
    } else {
      this.eventEmitter.drawInput(roomId, playerId);
    }

    this.checkRoundEnd(game);
  }

  checkRoundEnd(game: Garticphone) {
    const timer = this.timerRepository.findById(game.roomId);

    if (game.isAllInputed) {
      clearTimeout(timer?.timer);
      console.log(game.players.map((player) => player.album));
      if (game.isGameEnded) {
        this.eventEmitter.gameEnd(game.roomId);
        this.gameRepository.save(game);
      } else {
        game.roundEnd();
        this.roundStart(game);
      }
    }
  }

  roundStart(game: Garticphone) {
    const players = game.getPlayerList();
    const roundInfo = game.roundData;

    players.forEach((player) => {
      const target = game.getAlbumOwner(player.id, game.currentRound);
      if (!target || player.isExit) return;

      const lastData = target.getLastAlbumData();

      const type = game.currentRoundType;
      const data = {
        keyword: type !== "keyword" ? lastData : null,
        img: type !== "painting" ? lastData : null,
        roundInfo,
      };

      this.eventEmitter.roundstart(player.id, type, data);
    });

    const timerId = setTimeout(
      () => this.timeOut(game.roomId),
      game.roundTime * MSEC_PER_SEC
    );

    this.timerRepository.save(game.roomId, new Timer(game.roomId, timerId));

    this.gameRepository.save(game);
  }

  cancelAlbumData(roomId: string, playerId: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    game.cancelAlbumData(playerId);
    if (game.currentRoundType === "keyword") {
      this.eventEmitter.keywordCancel(roomId, playerId);
    } else {
      this.eventEmitter.drawCancel(roomId, playerId);
    }

    this.gameRepository.save(game);
  }

  exitGame(roomId: string, playerId: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    const result = game.exitGame(playerId);

    if (result) {
      this.eventEmitter.playerExit(game.roomId, playerId);
      this.checkRoundEnd(game);
    }

    if (game.isAllExit) {
      this.roomAPI.gameEnded(game.roomId);
      this.gameRepository.delete(game.roomId);
    }
  }
}
