import { Game, Player } from "./game";
import { CatchMindEventAdapter } from "../outBound/CatchMindEvent.Adapter";
import { CatchMindEvent } from "../outBound/catchMindEvent.port";
import { CatchMindInputPort } from "../inBound/CatchMindInput.port";

export class CatchMind implements Game, CatchMindInputPort {
  keyword: string;
  timerId: NodeJS.Timeout | undefined;
  roomState: number;
  goalScore: number;

  gameMode: string;
  currentRound: number;
  roundTime: number;
  totalRound: number;
  players: Player[];
  roomId: string;

  eventEmitter: CatchMindEvent;
  isGameEnded = false;
  readyCount = 0;
  turnPlayerIdx = 0;

  constructor(
    goalScore: number,
    players: Player[],
    roundTime: number,
    roomId: string
  ) {
    this.players = players;
    this.goalScore = goalScore;
    this.keyword = "";
    this.timerId = undefined;
    this.roomState = 0;

    this.gameMode = "catchMind";
    this.currentRound = 1;
    this.roundTime = roundTime;
    this.totalRound = 1;
    this.roomId = roomId;

    this.eventEmitter = new CatchMindEventAdapter(roomId);
  }

  get turnPlayer(): Player {
    return this.players[this.turnPlayerIdx];
  }

  get roundInfo() {
    return {
      currentRound: this.currentRound,
      roundTime: this.roundTime,
      turnPlayer: this.turnPlayer.peerId,
    };
  }

  gameStart(gameMode: string) {
    this.gameMode = gameMode;
    this.eventEmitter.gameStart({
      gameMode,
      totalRound: this.totalRound,
      roundInfo: this.roundInfo,
    });
  }

  drawStart(keyword: string) {
    this.keyword = keyword;
    this.eventEmitter.drawStart(this.turnPlayer.peerId);

    this.timerId = setTimeout(() => {
      this.roundEnd(null);
    }, this.roundTime);
  }

  roundEnd(winner: string | null) {
    this.isGameEnded = this.currentRound++ === this.totalRound;

    this.eventEmitter.roundEnd({
      isLastRound: this.isGameEnded,
      playerScoreList: this.players.map(({ peerId, score }) => {
        return { peerId, score };
      }),
      roundWinner: winner,
    });

    this.turnPlayerIdx = (this.turnPlayerIdx + 1) % this.players.length;

    return this.isGameEnded;
  }

  checkAnswer(answer: string, playerId: string) {
    if (this.keyword === answer && this.keyword.length) {
      this.roundEnd(playerId);
      clearTimeout(this.timerId);
    }
  }

  roundReady(id: string) {
    this.eventEmitter.roundReady(id);

    if (++this.readyCount === this.players.length) {
      this.roundStart();
      this.readyCount = 0;
    }
  }

  roundStart() {
    this.eventEmitter.roundStart(this.roundInfo);
  }
}
