import { Game } from "../game/game";
import { Player } from "../player/player";
import { CatchMind } from "../game/catchMind";
import { io as socketServer } from "../../app";

export class Room {
  roomId: string;
  players: Player[];
  host: Player | null;
  game: Game | null;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.players = [];
    this.host = null;
    this.game = null;
  }

  join(newPlayer: Player) {
    if (this.players.length === 0) {
      this.host = newPlayer;
    }
    this.players.push(newPlayer);
    newPlayer.joinRoom(this.roomId);

    newPlayer.on("disconnect", () => {
      this.players = this.players.filter(
        (player) => player.id !== newPlayer.id
      );
    });

    // 우리 방에 들어와 있는 사람들에게 (나 포함)
    socketServer.to(this.roomId).emit(
      "join",
      this.players.map((player: Player) => {
        return {
          userName: player.userName,
          userId: player.socket.id,
          avata: player.avata,
          score: player.score,
        };
      })
    );

    newPlayer.on("game-start", (data: { gameMode: string }) => {
      if (newPlayer !== this.host) {
        return;
      }

      this.startGame(data.gameMode);
    });
  }

  leave(outPlayer: Player) {
    this.players = this.players.filter((player) => {
      return player.id !== outPlayer.id;
    });

    if (outPlayer === this.host) {
      if (this.players.length !== 0) {
        this.host = this.players[0];
      } else {
        this.host = null;
      }
    }
  }

  startGame(gameMode: string) {
    switch (gameMode) {
      case "catchMind": // 여기 나중에 상수화
        this.game = new CatchMind(5, this.players, 60000); // 나중에 상수화
        // 여기서 모두에게 게임 시작 이벤트 전송
        break;
    }
  }
}
