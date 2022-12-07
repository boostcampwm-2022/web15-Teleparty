import Crypto from "crypto";

type DataType = "keyword" | "painting";

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
    while (this.orderSeed === this.players.length) {
      this.orderSeed = getPrime();
    }
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
    return this.players.length === this.sendIdx;
  }

  get isAllExit() {
    return this.players.every((player) => player.isExit);
  }

  isHost(playerId: string) {
    return this.players[0].id === playerId;
  }
  cancelAlbumData(playerId: string) {
    const ownerPlayer = this.getAlbumOwner(playerId, this.currentRound);
    const player = this.players.find((player) => player.id === playerId);

    if (!ownerPlayer || !player) return;

    ownerPlayer.cancelAlbumData(this.currentRound);
    player.isInputEnded = false;
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
    this.players.forEach((player) => {
      if (!player.isExit) {
        player.isInputEnded = false;
      } else {
        this.setAlbumData("", player.id);
      }
    });
  }

  exitGame(playerId: string) {
    const player = this.players.find((player) => player.id == playerId);

    if (player) {
      player.exitGame();
      this.setAlbumData("", playerId);
      return true;
    } else return false;
  }
}
