export interface Player {
  id: string;
  score: number;
  isReady: boolean;
}

export class Timer {
  roomId: string;
  timer: NodeJS.Timeout;
  constructor(roomId: string, id: NodeJS.Timeout) {
    this.roomId = roomId;
    this.timer = id;
  }
  cancelTimer() {
    clearTimeout(this.timer);
  }
}

export class CatchMind {
  keyword: string;
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
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) {
    this.players = players.map((playerId) => {
      return { id: playerId, score: 0, isReady: false, isExit: false };
    });
    this.goalScore = goalScore;
    this.keyword = "";
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

  get isAllExit() {
    return this.players.length === 0;
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
