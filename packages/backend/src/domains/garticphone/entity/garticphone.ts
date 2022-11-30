type DataType = "keyword" | "painting";

class AlbumData {
  type: DataType;
  ownerId: string;
  data: string;

  constructor(type: DataType, ownerId: string, data: string) {
    this.type = type;
    this.ownerId = ownerId;
    this.data = data;
  }
}

class Player {
  id: string;
  album: AlbumData[] = [];

  constructor(id: string) {
    this.id = id;
  }

  setAlbumData(index: number, data: AlbumData) {
    this.album[index] = data;
  }

  getAlbum() {
    return this.album;
  }
}

export class Garticphone {
  totalRound: number;
  currentRound: number;
  players: Player[];
  timerId: NodeJS.Timer | undefined;
  roundTime: number;

  constructor(players: string[], roundTime: number) {
    this.players = players.map((playerId) => new Player(playerId));
    this.totalRound = players.length;
    this.roundTime = roundTime;
    this.currentRound = 1;
  }

  get currentRoundType() {
    return this.currentRound % 2 === 0 ? "painting" : "keyword";
  }

  setAlbumData(data: string, playerId: string) {
    const albumData = new AlbumData(this.currentRoundType, playerId, data);
    const ownerPlayer = this.getAlbumOwner(playerId, this.currentRound);

    if (!ownerPlayer) return;

    ownerPlayer.setAlbumData(this.currentRound, albumData);
  }

  getAlbumOwner(playerId: string, round: number): Player | undefined {
    const initailIdx = this.players.findIndex(
      (player) => player.id === playerId
    );
    if (!initailIdx) return;

    const currentIdx = (initailIdx + round - 1) % this.players.length;

    return this.players[currentIdx];
  }

  getAlbum(playerId: string) {
    const player = this.players.find((player) => player.id === playerId);

    if (!player) return;

    return player.album;
  }

  roundEnd() {
    this.currentRound++;
  }

  setTimer(timerId: NodeJS.Timer) {
    this.timerId = timerId;
  }
}
