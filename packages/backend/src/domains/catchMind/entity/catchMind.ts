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
      this.remainPlayerNum <= 1
    );
  }

  get isAllReady() {
    return this.players.every((player) => player.isReady);
  }

  get remainPlayerNum() {
    return this.players.length;
  }

  get scoreMap() {
    const playerScoreMap: { [K: string]: number } = {};
    this.players.forEach((player: Player) => {
      playerScoreMap[player.id] = player.score;
    });
    return playerScoreMap;
  }

  setKeyword(keyword: string, playerId: string) {
    if (this.turnPlayer.id !== playerId || !keyword) return false;

    this.keyword = keyword;
    return true;
  }

  nextTurn() {
    this.turnPlayerIdx = (this.turnPlayerIdx + 1) % this.players.length;
    this.currentRound++;

    this.players.forEach((player) => (player.isReady = false));
  }

  isRightAnswer(keyword: string) {
    return this.keyword.length && keyword === this.keyword;
  }

  challengeAnswer(keyword: string, playerId: string) {
    if (this.isRightAnswer(keyword) && this.turnPlayer.id === playerId) {
      this.addScore(playerId);
      this.keyword = "";
      return true;
    } else return false;
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

  timeout() {
    this.keyword = "";
  }

  ready(id: string) {
    const player = this.players.find((player) => player.id === id);

    if (player && !player.isReady) {
      player.isReady = true;
      return true;
    } else return false;
  }

  exitGame(playerId: string) {
    const prevLen = this.players.length;
    this.players = this.players.filter((player) => player.id !== playerId);
    const curLen = this.players.length;

    this.turnPlayerIdx %= curLen;

    return prevLen !== curLen;
  }
}
