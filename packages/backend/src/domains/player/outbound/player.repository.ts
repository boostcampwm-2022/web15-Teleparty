import { redisCli } from "../../../config/redis";
import { Player } from "../entity/player.entitiy";
import { PlayerRepositoryDataPort } from "./player.port";

const PLAYERS_KEY = "players";

export class PlayerRepository implements PlayerRepositoryDataPort {
  create(peerId: string, userName: string, avata: string, roomId: string) {
    const player = new Player(peerId, userName, avata, roomId);

    const setPlayer = async (newPlayer: Player) => {
      await redisCli.HSET(
        PLAYERS_KEY,
        newPlayer.peerId,
        JSON.stringify(newPlayer)
      );

      await redisCli.SET(peerId, JSON.stringify(newPlayer));
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
    const playerJson = await redisCli.HGET(PLAYERS_KEY, peerId);

    if (playerJson) {
      const playerInfo = JSON.parse(playerJson);

      return new Player(
        playerInfo.peerId,
        playerInfo.userName,
        playerInfo.avata,
        playerInfo.roomId
      );
    }

    return;
  }

  async findAll() {
    const allPlayer = await redisCli.HVALS(PLAYERS_KEY);

    if (!allPlayer) {
      return;
    }

    return allPlayer.map((playerJson: string) => {
      const playerInfo = JSON.parse(playerJson);
      return new Player(
        playerInfo.peerId,
        playerInfo.userName,
        playerInfo.avata,
        playerInfo.roomId
      );
    });
  }
}
