import { Player } from "./player";

interface CatchMindInitalData {
  goalScore: number;
  players: Player[];
  roundTime: number;
  roomId: string;
  totalRound: number;
  keyword: string;
  currentRound: number;
  turnPlayerIdx: number;
}

export class CatchMind {
  goalScore: number;
  players: Player[];
  roundTime: number;
  roomId: string;
  totalRound: number;
  keyword: string;
  currentRound: number;
  turnPlayerIdx: number;

  constructor(data: CatchMindInitalData) {
    this.players = data.players;
    this.goalScore = data.goalScore;
    this.roundTime = data.roundTime;
    this.totalRound = data.totalRound;
    this.roomId = data.roomId;
    this.keyword = data.keyword;
    this.currentRound = data.currentRound;
    this.turnPlayerIdx = data.turnPlayerIdx;
  }

  get turnPlayer() {
    return this.players[this.turnPlayerIdx];
  }

  get roundInfo() {
    return {
      currentRound: this.currentRound,
      roundTime: this.roundTime,
      turnPlayer: this.turnPlayer.id,
    };
  }

  get isGameEnded() {
    return (
      this.currentRound === this.totalRound ||
      this.players.some((player) => player.score >= this.goalScore) ||
      this.leftPlayerNum <= 1
    );
  }

  get isAllReady() {
    return this.players.every((player) => player.isReady);
  }

  get leftPlayerNum() {
    return this.players.length;
  }

  get scoreMap() {
    const playerScoreMap: { [K: string]: number } = {};
    this.players.forEach((player: Player) => {
      playerScoreMap[player.id] = player.score;
    });
    return playerScoreMap;
  }

  nextTurn() {
    this.turnPlayerIdx = (this.turnPlayerIdx + 1) % this.players.length;
    this.currentRound++;

    this.players.forEach((player) => (player.isReady = false));
  }

  isRightAnswer(keyword: string, playerId: string) {
    return (
      this.keyword?.length &&
      keyword === this.keyword &&
      playerId !== this.turnPlayer.id
    );
  }

  isTurnPlayer(playerId: string) {
    return this.turnPlayer.id === playerId;
  }

  addScore(playerId: string) {
    const player = this.players.find((player) => player.id === playerId);
    if (player) {
      player.score++;
    }
  }

  clearKeyword() {
    this.keyword = "";
  }

  findPlayer(id: string) {
    return this.players.find((player) => player.id === id);
  }

  ready(id: string) {
    const player = this.players.find((player) => player.id === id);

    if (player) player.isReady = true;
  }

  exitGame(playerId: string) {
    const prevLen = this.players.length;
    this.players = this.players.filter((player) => player.id !== playerId);
    const curLen = this.players.length;

    this.turnPlayerIdx %= curLen;

    return prevLen !== curLen;
  }
}
