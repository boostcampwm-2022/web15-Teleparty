import { StartData } from "../../../types/gartic.type";
import { DomainConnecter } from "../../../utils/domainConnecter";
import { GarticphoneUseCase } from "../useCases/garticphone.useCase";
import { GarticphonePort } from "../useCases/ports/garticphoneController.port";

const connecter = DomainConnecter.getInstance();
const service: GarticphonePort = new GarticphoneUseCase();

connecter.register(
  "garticphone/game-start",
  ({ roomId, drawTime, keywordTime, players }: StartData) => {
    console.log("start-gartic", roomId);
    service.startGame(roomId, drawTime, keywordTime, players);
  }
);

connecter.register(
  "garticphone/player-quit",
  ({ roomId, playerId }: { roomId: string; playerId: string }) => {
    service.exitGame(roomId, playerId);
  }
);
