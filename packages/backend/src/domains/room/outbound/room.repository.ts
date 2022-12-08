import { GAME_MODE, Room } from "../entity/room.entity";
import { NewPlayer, RoomRepositoryDataPort } from "./room.port";
import { redisCli } from "../../../config/redis";
import { Player } from "../entity/player.entitiy";

export class RoomRepository implements RoomRepositoryDataPort {
  private static players: string[] = [];

  create(roomId: string) {
    const room = new Room({ roomId });

    this.save(roomId, room);
    return room;
  }

  createUser(data: NewPlayer) {
    const { peerId } = data;
    const newPlayer = new Player(data);
    RoomRepository.players.push(peerId);
    redisCli.set(makeHashKeyByPeerId(peerId), JSON.stringify(newPlayer));
    return newPlayer;
  }

  save(roomId: string, room: Room) {
    redisCli.set(makeHashKeyByRoomId(roomId), JSON.stringify(room));
  }

  findAllPlayer() {
    return RoomRepository.players;
  }

  async findOneByRoomId(roomId: string) {
    const data = await redisCli.get(makeHashKeyByRoomId(roomId));

    if (!data) return;
    console.log(data);
    const room = new Room(JSON.parse(data));
    return room;
  }

  async findOneByPeerId(peerId: string) {
    const player = await this.findPlayerByPeerId(peerId);
    if (!player) {
      return undefined;
    }
    const roomJson = await redisCli.get(makeHashKeyByRoomId(player.roomId));
    if (!roomJson) {
      return undefined;
    }

    const room = new Room(JSON.parse(roomJson));

    return room;
  }

  async findPlayerByPeerId(peerId: string) {
    const playerJson = await redisCli.get(makeHashKeyByPeerId(peerId));

    if (!playerJson) {
      return undefined;
    }

    return new Player(JSON.parse(playerJson));
  }

  async deleteByRoomId(roomId: string) {
    console.log("delete roomId", roomId);

    if (await redisCli.exists(makeHashKeyByRoomId(roomId)))
      redisCli.del(makeHashKeyByRoomId(roomId));
  }

  deletePlayer(peerId: string, room: Room) {
    redisCli.unlink(makeHashKeyByPeerId(peerId));

    room.players = room.players.filter((player) => {
      return player.peerId !== peerId;
    });

    this.save(room.roomId, room);

    RoomRepository.players = RoomRepository.players.filter((id) => {
      return id !== peerId;
    });
  }
}

const makeHashKeyByPeerId = (peerId: string): string => {
  return `player/${peerId}`;
};

const makeHashKeyByRoomId = (roomId: string): string => {
  return `room/${roomId}`;
};
