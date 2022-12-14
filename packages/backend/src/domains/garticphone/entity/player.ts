import { AlbumData } from "./albumData";

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
