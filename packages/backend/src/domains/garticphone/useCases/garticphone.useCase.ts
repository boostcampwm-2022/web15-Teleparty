import { GarticphonePort, RoundType } from "./ports/garticphoneController.port";
import { GarticphoneRepository } from "../presenters/garticphone.repository";
import { GarticphoneRepositoryDataPort } from "./ports/garitcphone.repository.port";
import { Garticphone } from "../entity/garticphone";
import { ClientAPIPort } from "./ports/clientAPI.port";
import { ClientAPIPresenter } from "../presenters/clientAPI.presenter";
import { RoomAPIPort } from "./ports/roomAPI.port";
import { RoomAPIPresenter } from "../presenters/roomAPI.presenter";
import { TimerRepository, Timer } from "../../../utils/timer";
import { TimerRepositoryDataPort } from "./ports/timer.repository.port";
import { Player } from "../entity/player";
import { Chalk } from "../../../utils/chalk";

const MSEC_PER_SEC = 1000;
export class GarticphoneUseCase implements GarticphonePort {
  gameRepository: GarticphoneRepositoryDataPort = new GarticphoneRepository();
  timerRepository: TimerRepositoryDataPort = new TimerRepository();
  eventEmitter: ClientAPIPort = new ClientAPIPresenter();
  roomAPI: RoomAPIPort = new RoomAPIPresenter();

  async startGame(
    roomId: string,
    drawTime: number,
    keywordTime: number,
    playerIds: string[]
  ) {
    console.log(Chalk.bgYellow("start gartic"), roomId);
    const players = playerIds.map((playerId) => new Player(playerId));
    const game = new Garticphone({ players, drawTime, keywordTime, roomId });

    this.eventEmitter.gameStart(game.roomId, {
      gameMode: "Garticphone",
      totalRound: game.players.length,
      roundInfo: game.roundData,
    });

    this.setTimer(roomId, game.currentRoundTime);

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async sendAlbum(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game || !game.isHost(playerId)) {
      this.gameRepository.release(roomId);
      return;
    }

    const albumData = game.getNextAlbum();

    if (!albumData) {
      this.gameRepository.release(roomId);
      return;
    }

    this.eventEmitter.sendAlbum(roomId, albumData);

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  setTimer(roomId: string, time: number) {
    const timerId = setTimeout(
      () => this.eventEmitter.timeOut(roomId),
      time * MSEC_PER_SEC
    );

    this.timerRepository.save(roomId, new Timer(roomId, timerId));
  }

  async setAlbumData(
    roomId: string,
    playerId: string,
    data: string,
    type: RoundType
  ) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    const result = game.setAlbumData(data, playerId, type);
    if (!result) {
      this.gameRepository.release(roomId);
      return;
    }

    if (game.currentRoundType === "keyword") {
      this.eventEmitter.keywordInput(roomId, playerId);
    } else {
      this.eventEmitter.drawInput(roomId, playerId);
    }

    console.log(
      Chalk.fgMagenta(
        `set album setRate: ${
          game.players.filter((p) => p.isInputEnded).length
        }/${game.players.length}`
      ),
      roomId,
      playerId
    );

    this.checkRoundEnd(game) && this.roundStart(game);

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  checkRoundEnd(game: Garticphone) {
    const timer = this.timerRepository.findById(game.roomId);

    if (game.isAllInputed) {
      clearTimeout(timer?.timer);
      console.log(
        Chalk.fgCyan("Gartic round End"),
        game.currentRound,
        game.roomId
      );

      if (game.isGameEnded) {
        console.log(Chalk.bgCyan("game end"), game.roomId);
        this.eventEmitter.gameEnd(game.roomId);
      } else {
        game.roundEnd();
        return true;
      }
    }
    return false;
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

    this.setTimer(game.roomId, game.currentRoundTime);
  }

  async cancelAlbumData(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    const result = game.cancelAlbumData(playerId);
    if (!result) {
      this.gameRepository.release(roomId);
      return;
    }

    if (game.currentRoundType === "keyword") {
      this.eventEmitter.keywordCancel(roomId, playerId);
    } else {
      this.eventEmitter.drawCancel(roomId, playerId);
    }

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async exitGame(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    const prevState = game.isGameEnded;
    const result = game.exitGame(playerId);

    if (result) {
      console.log("exit player", playerId);
      this.eventEmitter.playerExit(game.roomId, playerId);
      if (!prevState) this.checkRoundEnd(game);
    }

    if (game.isAllExit) {
      console.log(Chalk.fgRed("end game"), game.roomId);
      this.roomAPI.gameEnded(game.roomId);
      this.gameRepository.delete(game.roomId);
      return;
    }

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }
}
