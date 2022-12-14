import Crypto from "crypto";
import { GarticGameData } from "../../../types/gartic.type";
import { RoundType } from "../useCases/ports/garticphoneController.port";
import { AlbumData } from "./albumData";
import { Player } from "./player";

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
  drawTime: number;
  keywordTime: number;
  roomId: string;
  sendIdx: number;
  orderSeed: number;

  constructor(data: GarticGameData) {
    this.players = data.players;
    this.totalRound = data.totalRound || data.players.length;
    this.drawTime = data.drawTime || 90;
    this.keywordTime = data.keywordTime || 45;
    this.roomId = data.roomId;
    this.currentRound = data.currentRound || 1;
    this.sendIdx = data.sendIdx || 0;
    this.orderSeed = data.orderSeed || getPrime();
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
      roundTime: this.currentRoundTime,
      currentRound: this.currentRound,
    };
  }

  get currentRoundTime() {
    return this.currentRoundType === "keyword"
      ? this.keywordTime
      : this.drawTime;
  }

  get isGameEnded() {
    return (
      this.totalRound === this.currentRound &&
      this.players.every((player) => player.isInputEnded)
    );
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

    if (!ownerPlayer || !player || this.isGameEnded) return true;

    ownerPlayer.cancelAlbumData(this.currentRound);
    player.isInputEnded = false;

    return true;
  }

  setAlbumData(data: string, playerId: string, type: RoundType) {
    if (this.currentRoundType !== type || this.isGameEnded) return false;

    const ownerPlayer = this.getAlbumOwner(playerId, this.currentRound);
    const player = this.players.find((player) => player.id === playerId);

    if (!ownerPlayer || !player) return false;

    const albumData = new AlbumData(this.currentRoundType, playerId, data);
    ownerPlayer.setAlbumData(this.currentRound - 1, albumData);
    player.isInputEnded = true;

    return true;
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

  getNextAlbum() {
    const player = this.players[this.sendIdx++];
    if (!player || !this.isGameEnded) return;
    return {
      peerId: player.id,
      isLast: this.isLastAlbum,
      result: player.getAlbum().map((data) => {
        return {
          peerId: data.ownerId,
          keyword: data.type === "keyword" ? data.data : null,
          img: data.type === "painting" ? data.data : null,
        };
      }),
    };
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
        this.setAlbumData("", player.id, this.currentRoundType);
      }
    });
  }

  exitGame(playerId: string) {
    const player = this.players.find((player) => player.id == playerId);

    if (player) {
      player.exitGame();
      if (!this.isGameEnded)
        this.setAlbumData("", playerId, this.currentRoundType);
      return true;
    } else return false;
  }
}
