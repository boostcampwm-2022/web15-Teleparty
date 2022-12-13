import { GarticphonePort, RoundType } from "./ports/garticphoneController.port";
import { GarticphoneRepository } from "../presenters/garticphone.repository";
import { GarticphoneRepositoryDataPort } from "./ports/garitcphone.repository.port";
import { Garticphone } from "../entity/garticphone";
import { ClientAPIPort } from "./ports/clientAPI.port";
import { GarticphoneEventPresenter } from "../presenters/garticphoneEvent.presenter";
import { RoomAPIPort } from "./ports/roomAPI.port";
import { RoomAPIPresenter } from "../presenters/roomAPI.presenter";
import { TimerRepository, Timer } from "../../../utils/timer";
import { TimerRepositoryDataPort } from "./ports/timer.repository.port";
import { Player } from "../entity/player";

const MSEC_PER_SEC = 1000;
export class GarticphoneService implements GarticphonePort {
  gameRepository: GarticphoneRepositoryDataPort = new GarticphoneRepository();
  timerRepository: TimerRepositoryDataPort = new TimerRepository();
  eventEmitter: ClientAPIPort = new GarticphoneEventPresenter();
  roomAPI: RoomAPIPort = new RoomAPIPresenter();

  async startGame(
    roomId: string,
    drawTime: number,
    keywordTime: number,
    playerIds: string[]
  ) {
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

    const albumData = this.parseAlbum(game);
    if (!albumData) {
      this.gameRepository.release(roomId);
      return;
    }

    this.eventEmitter.sendAlbum(roomId, albumData);

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  parseAlbum(game: Garticphone) {
    const player = game.nextPlayer();

    if (!player) {
      return;
    }

    return {
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

    await this.checkRoundEnd(game);
    this.gameRepository.release(roomId);
  }

  async checkRoundEnd(game: Garticphone) {
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
        await this.gameRepository.save(game);
      } else {
        game.roundEnd();
        await this.roundStart(game);
      }
    } else {
      await this.gameRepository.save(game);
    }
  }

  async roundStart(game: Garticphone) {
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

    await this.gameRepository.save(game);
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

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async exitGame(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      console.log("why canceled?", roomId);
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

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }
}
