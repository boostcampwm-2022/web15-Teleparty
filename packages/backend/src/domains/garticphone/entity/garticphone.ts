import Crypto from "crypto";

type DataType = "keyword" | "painting";

export class AlbumData {
  type: DataType;
  ownerId: string;
  data: string;

  constructor(type: DataType, ownerId: string, data: string) {
    this.type = type;
    this.ownerId = ownerId;
    this.data = data;
  }
}

export class Player {
  id: string;
  isInputEnded: boolean;
  isExit: boolean;
  album: AlbumData[] = [];

  constructor(id: string) {
    this.id = id;
    this.isInputEnded = false;
    this.isExit = false;
  }

  setAlbumData(index: number, data: AlbumData) {
    this.album[index] = data;
  }

  cancelAlbumData(index: number) {
    if (this.album[index]) {
      this.album.pop();
    }

    this.isInputEnded = false;
  }

  getLastAlbumData() {
    return this.album.at(-1)?.data || "";
  }

  getAlbum() {
    return this.album;
  }

  exitGame() {
    this.isExit = true;
  }
}

const getPrime = () => {
  const primeArrayBuffer = Crypto.generatePrimeSync(
    Math.floor(Math.random() * 7) + 2
  );
  const primeArray = new Uint8Array(primeArrayBuffer);
  return primeArray[0];
};

export class Garticphone {
  totalRound: number;
  currentRound: number;
  players: Player[];
  timerId: NodeJS.Timer | undefined;
  roundTime: number;
  roomId: string;
  sendIdx: number;
  orderSeed: number;

  constructor(players: string[], roundTime: number, roomId: string) {
    this.players = players.map((playerId) => new Player(playerId));
    this.totalRound = players.length;
    this.roundTime = roundTime;
    this.roomId = roomId;
    this.currentRound = 1;
    this.sendIdx = 0;
    this.orderSeed = getPrime();
  }

  get currentRoundType() {
    return this.currentRound % 2 === 0 ? "painting" : "keyword";
  }

  get isAllInputed() {
    return this.players.every((player) => player.isInputEnded);
  }

  get roundData() {
    return {
      roundTime: this.roundTime,
      currentRound: this.currentRound,
    };
  }

  get isGameEnded() {
    return this.totalRound === this.currentRound;
  }

  get isLastAlbum() {
    return this.players.length === this.sendIdx + 1;
  }

  get isAllExit() {
    return this.players.every((player) => player.isExit);
  }

  isHost(playerId: string) {
    return this.players[0].id === playerId;
  }
  cancelAlbumData(playerId: string) {
    const ownerPlayer = this.getAlbumOwner(playerId, this.currentRound);

    if (!ownerPlayer) return;

    ownerPlayer.cancelAlbumData(this.currentRound);
  }

  setAlbumData(data: string, playerId: string) {
    const albumData = new AlbumData(this.currentRoundType, playerId, data);
    const ownerPlayer = this.getAlbumOwner(playerId, this.currentRound);
    const player = this.players.find((player) => player.id === playerId);

    if (!ownerPlayer || !player) return;

    ownerPlayer.setAlbumData(this.currentRound - 1, albumData);
    player.isInputEnded = true;
  }

  getAlbumOwner(playerId: string, round: number): Player | undefined {
    const initailIdx = this.players.findIndex(
      (player) => player.id === playerId
    );

    if (initailIdx === -1) return;

    const currentIdx =
      (initailIdx + (round - 1) * this.orderSeed) % this.players.length;

    return this.players[currentIdx];
  }

  nextPlayer() {
    return this.players[this.sendIdx++];
  }

  getPlayerList() {
    return this.players;
  }

  roundEnd() {
    this.currentRound++;
    this.players.forEach((player) => (player.isInputEnded = false));
  }

  setTimer(timerId: NodeJS.Timer) {
    this.timerId = timerId;
  }

  exitGame(playerId: string) {
    const player = this.players.find((player) => player.id == playerId);

    if (player) {
      player.exitGame();
      return true;
    } else return false;
  }
}
