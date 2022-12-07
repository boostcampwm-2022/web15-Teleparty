import { redisCli } from "../../../config/redis";
import { Player } from "../entity/player.entitiy";
import { PlayerRepositoryDataPort } from "./player.port";

const PLAYERS_KEY = "players";

export class PlayerRepository implements PlayerRepositoryDataPort {
  create(peerId: string, userName: string, avata: string) {
    const player = new Player(peerId, userName, avata);

    const setPlayer = async (newPlayer: Player) => {
      await redisCli.HSET(
        PLAYERS_KEY,
        newPlayer.peerId,
        JSON.stringify(newPlayer)
      );
    };

    setPlayer(player);

    return player;
  }

  deleteByPeerId(peerId: string) {
    const deletePlayer = async (peerId: string) => {
      await redisCli.HDEL(PLAYERS_KEY, peerId);
    };

    deletePlayer(peerId);

    return;
  }

  async findOneByPeerId(peerId: string) {
    const playerInfo = await redisCli.HGET(PLAYERS_KEY, peerId);

    if (playerInfo) {
      const playerJSON = JSON.parse(playerInfo);

      return new Player(
        playerJSON.peerId,
        playerJSON.userName,
        playerJSON.avata
      );
    }

    return;
  }

  async findAll() {
    const allPlayer = await redisCli.HVALS(PLAYERS_KEY);

    if (!allPlayer) {
      return;
    }

    return allPlayer.map((playerJSON: string) => {
      const playerInfo = JSON.parse(playerJSON);
      return new Player(
        playerInfo.peerId,
        playerInfo.userName,
        playerInfo.avata
      );
    });
  }
}
