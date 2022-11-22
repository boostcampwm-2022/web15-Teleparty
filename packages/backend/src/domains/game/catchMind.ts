import { Player } from "../player/player";
import { Game } from "./game";

export class CatchMind implements Game {
  round: number;
  players: Player[];
  keyWord: string;
  endTime: number;
  timerId: NodeJS.Timeout | null;
  roomState: number;
  maxScore: number;

  constructor(maxScore: number, players: Player[], endTime: number) {
    this.players = players;
    this.keyWord = "";
    this.endTime = endTime;
    this.timerId = null;
    this.roomState = 0;
    this.round = 0;
    this.maxScore = maxScore;
  }

  setSocketListner(players: Player[]) {
    players.forEach((player) => {
      const inputKeyEvent = (data: any) => this.setKeyWord(data, player);
      const inputAnswerEvent = (data: any) => this.validKeyWord(data, player);

      player.on("chatting", inputKeyEvent);
      player.on("input-answer", inputAnswerEvent);

      player.on("end-game", () => {
        player.off("chatting", inputKeyEvent);
        player.off("input-answer", inputAnswerEvent);
      });
    });
    return;
  }

  // setTurnPlayer(player: Player) {
  //   this.players = player;
  // }

  setKeyWord(keyword: string, player: Player) {
    this.keyWord = keyword;
    // this.setRoomState(); // 게임 상태 변경
    // 여기서 모두에게 전송(게임 상태 변경 정보)
  }

  validKeyWord(answer: string, player: Player) {
    if (this.keyWord === answer) {
      player.pulsScore(1); // 여기 나중에 상수화
      // 모두에게 라운드 종료 및 정답자, 턴 플레이어 변경 이벤트 전송
      // if player.score >= this.maxScore : 게임 종료 이벤트
      // 턴플레이어 변경
    }
  }

  setRoomState(roomState: number) {
    this.roomState = roomState;
  }

  startTimer() {
    this.timerId = setTimeout(() => {
      // 여기에 라운드 종료
      return;
    }, this.endTime);
  }

  stopTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }
}
