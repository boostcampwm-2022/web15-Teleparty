import { GAME_MODE, Room } from "../entity/room.entity";
import { NewPlayer, RoomRepositoryDataPort } from "./room.port";
import { redisCli } from "../../../config/redis";
import { Player } from "../entity/player.entitiy";
import { RedisLock } from "../../../utils/redisLock";

export class RoomRepository
  extends RedisLock
  implements RoomRepositoryDataPort
{
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

  async save(roomId: string, room: Room) {
    await redisCli.set(makeHashKeyByRoomId(roomId), JSON.stringify(room));
  }

  findAllPlayer() {
    return RoomRepository.players;
  }

  async findOneByRoomId(roomId: string) {
    await this.tryLock(makeLockKeyByRoomId(roomId));
    const data = await redisCli.get(makeHashKeyByRoomId(roomId));

    if (!data) return;
    // console.log(data);
    const room = new Room(JSON.parse(data));
    return room;
  }

  async findOneByPeerId(peerId: string) {
    const player = await this.findPlayerByPeerId(peerId);
    if (!player) {
      return undefined;
    }
    await this.tryLock(makeLockKeyByRoomId(player.roomId));
    const roomJson = await redisCli.get(makeHashKeyByRoomId(player.roomId));
    if (!roomJson) {
      this.release(player.roomId);
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
    // console.log("delete roomId", roomId);

    if (await redisCli.exists(makeHashKeyByRoomId(roomId)))
      redisCli.del(makeHashKeyByRoomId(roomId));
  }

  deletePlayer(peerId: string, room: Room) {
    redisCli.del(makeHashKeyByPeerId(peerId));

    room.players = room.players.filter((player) => {
      return player.peerId !== peerId;
    });

    this.save(room.roomId, room);

    RoomRepository.players = RoomRepository.players.filter((id) => {
      return id !== peerId;
    });
  }

  release(id: string): void {
    super.release(makeLockKeyByRoomId(id));
  }
}

const makeHashKeyByPeerId = (peerId: string): string => {
  return `player/${peerId}`;
};

const makeHashKeyByRoomId = (roomId: string): string => {
  return `room/${roomId}`;
};

const makeLockKeyByRoomId = (roomId: string) => {
  return `room-lock/${roomId}`;
};
