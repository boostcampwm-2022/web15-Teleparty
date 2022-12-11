import { GarticphonePort, RoundType } from "./garticphoneController.port";
import { GarticphoneRepository } from "../presenters/garticphone.repository";
import { GarticphoneRepositoryDataPort } from "./garitcphone.repository.port";
import { Garticphone, Player } from "../entity/garticphone";
import { GarticphoneEventPort } from "./garticphoneEvent.port";
import { GarticphoneEventPresenter } from "../presenters/garticphoneEvent.presenter";
import { GarticphoneToRoom } from "./garticphoneToRoom.port";
import { GarticphoneToRoomPresenter } from "../presenters/garticphoneToRoom.presenter";
import { TimerRepository, Timer } from "../../../utils/timer";
import { TimerRepositoryDataPort } from "./timer.repository.port";

const MSEC_PER_SEC = 1000;
export class GarticphoneService implements GarticphonePort {
  gameRepository: GarticphoneRepositoryDataPort = new GarticphoneRepository();
  timerRepository: TimerRepositoryDataPort = new TimerRepository();
  eventEmitter: GarticphoneEventPort = new GarticphoneEventPresenter();
  roomAPI: GarticphoneToRoom = new GarticphoneToRoomPresenter();

  startGame(roomId: string, roundTime: number, playerIds: string[]) {
    const players = playerIds.map((playerId) => new Player(playerId));
    const game = new Garticphone({ players, roundTime, roomId });

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
    this.gameRepository.release(roomId);
  }

  async sendAlbum(roomId: string, playerId: string) {
    // await this.gameRepository.getLock(roomId, playerId);
    const game = await this.gameRepository.findById(roomId);
    if (!game || !game.isHost(playerId) || !game.isGameEnded) {
      this.gameRepository.release(roomId);
      return;
    }
    const player = game.nextPlayer();

    if (!player) {
      this.gameRepository.release(roomId);
      return;
    }

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
    this.gameRepository.release(roomId);
  }

  timeOut(roomId: string) {
    this.eventEmitter.timeOut(roomId);
  }

  async setAlbumData(
    roomId: string,
    playerId: string,
    data: string,
    type: RoundType
  ) {
    // await this.gameRepository.getLock(roomId, playerId);
    const game = await this.gameRepository.findById(roomId);
    if (!game || game.currentRoundType !== type || game.isGameEnded) {
      this.gameRepository.release(roomId);
      return;
    }

    console.log(
      `\x1b[35mset album setRate: ${
        game.players.filter((p) => p.isInputEnded).length
      }/${game.players.length}\x1b[37m`,
      roomId,
      playerId
    );
    game.setAlbumData(data, playerId);

    if (game.currentRoundType === "keyword") {
      this.eventEmitter.keywordInput(roomId, playerId);
    } else {
      this.eventEmitter.drawInput(roomId, playerId);
    }

    this.checkRoundEnd(game);
    this.gameRepository.release(roomId);
  }

  checkRoundEnd(game: Garticphone) {
    const timer = this.timerRepository.findById(game.roomId);

    if (game.isAllInputed) {
      clearTimeout(timer?.timer);
      console.log(
        "\x1b[36mGartic round End\x1b[37m",
        game.currentRound,
        game.roomId
      );
      if (game.isGameEnded) {
        console.log("\x1b[46mgame end\x1b[40m", game.roomId);
        this.eventEmitter.gameEnd(game.roomId);
        this.gameRepository.save(game);
      } else {
        game.roundEnd();
        this.roundStart(game);
      }
    } else {
      this.gameRepository.save(game);
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

  async cancelAlbumData(roomId: string, playerId: string) {
    // await this.gameRepository.getLock(roomId, playerId);
    const game = await this.gameRepository.findById(roomId);
    if (!game || game.isGameEnded) {
      this.gameRepository.release(roomId);
      return;
    }

    game.cancelAlbumData(playerId);
    if (game.currentRoundType === "keyword") {
      this.eventEmitter.keywordCancel(roomId, playerId);
    } else {
      this.eventEmitter.drawCancel(roomId, playerId);
    }

    this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async exitGame(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }
    console.log(
      game.roomId,
      game.players.map((p) => p.isExit),
      playerId
    );

    const prevState = game.isGameEnded;
    const result = game.exitGame(playerId);

    console.log(result, game.isAllExit);
    if (result) {
      this.eventEmitter.playerExit(game.roomId, playerId);
      if (!prevState) this.checkRoundEnd(game);
    }

    if (game.isAllExit) {
      console.log("\x1b[33mexit game\x1b[37m", game.roomId);
      this.roomAPI.gameEnded(game.roomId);
      this.gameRepository.delete(game.roomId);
      return;
    }

    this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }
}
