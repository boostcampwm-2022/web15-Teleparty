export interface Player {
  id: string;
  score: number;
  isReady: boolean;
}

export class CatchMind {
  keyword: string;
  timerId: NodeJS.Timeout | undefined;
  goalScore: number;

  currentRound: number;
  roundTime: number;
  totalRound: number;
  players: Player[];
  roomId: string;

  readyCount: number;
  turnPlayerIdx: number;

  constructor(
    goalScore: number,
    players: Player[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) {
    this.players = players;
    this.goalScore = goalScore;
    this.keyword = "";
    this.timerId = undefined;
    this.currentRound = 1;
    this.roundTime = roundTime;
    this.totalRound = totalRound;
    this.roomId = roomId;
    this.readyCount = 0;
    this.turnPlayerIdx = 0;
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
      this.players.some((player) => player.score >= this.goalScore)
    );
  }

  get isAllReady() {
    return this.players.every((player) => player.isReady);
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

  addScore(playerId: string) {
    const player = this.players.find((player) => player.id == playerId);
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
    const player = this.players.find((player) => player.id == id);

    if (player) player.isReady = true;
  }
}
