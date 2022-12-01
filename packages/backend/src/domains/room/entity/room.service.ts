import { Player } from "../../player/entity/player.entitiy";
import { RoomPort } from "../inbound/room.port";
import { RoomApiAdapter } from "../outbound/room.api.adapter";
import { RoomEventAdapter } from "../outbound/room.event.adapter";
import {
  RoomApiPort,
  RoomRepositoryDataPort,
  RoomEvent,
  PlayerInfo,
} from "../outbound/room.port";
import { RoomRepository } from "../outbound/room.repository";
import { Room, GAME_MODE } from "./room.entity";
import { Player } from "../../player/entity/player.entitiy";

export class RoomService implements RoomPort {
  roomRepository: RoomRepositoryDataPort;
  roomApiAdapter: RoomApiPort;
  roomEventEmitter: RoomEvent;

  constructor() {
    this.roomRepository = new RoomRepository();
    this.roomApiAdapter = new RoomApiAdapter();
    this.roomEventEmitter = new RoomEventAdapter("123123");
  }

  // roomId는 playerController에서 처리하기 때문에 무조건 넘어옴
  join(peerId: string, roomId: string) {
    const room = this.roomRepository.findOneByRoomId(roomId);
    const players = this.roomApiAdapter.getAllPlayer();

    // 생성된 방이 없는 경우
    if (!room) {
      const newRoom: Room = this.roomRepository.create(roomId);
      newRoom.host = peerId;

      newRoom.players.push(peerId);
      this.roomEventEmitter = new RoomEventAdapter(newRoom.roomId);

      this.roomEventEmitter.join(
        {
          roomId: newRoom.roomId,
          players: newRoom.players.map((peerId) => {
            const player = players.find((player) => {
              return player.peerId === peerId;
            }) as Player;

            return {
              peerId: player.peerId,
              userName: player.userName,
              avataURL: player.avata,
              isHost: player.peerId === newRoom.host,
              isMicOn: player.isMicOn,
            };
          }),
        },
        peerId
      );

      return;
    }

    room.players.push(peerId);

    this.roomEventEmitter = new RoomEventAdapter(room.roomId);

    this.roomEventEmitter.join(
      {
        roomId: room.roomId,
        players: room.players.map((peerId) => {
          const player = players.find((player) => {
            return player.peerId === peerId;
          }) as Player;

          return {
            peerId: player.peerId,
            userName: player.userName,
            avataURL: player.avata,
            isHost: player.peerId === room.host,
            isMicOn: player.isMicOn,
          };
        }),
      },
      peerId
    );

    const playerInfo = players.find((player) => {
      return player.peerId === peerId;
    });

    if (playerInfo) {
      this.roomEventEmitter.newJoin(
        {
          peerId: playerInfo.peerId,
          userName: playerInfo.userName,
          avataURL: playerInfo.avata,
          isHost: playerInfo.peerId === room.host,
          isMicOn: playerInfo.isMicOn,
        },
        room.roomId
      );
    }

    return;
  }

  leave(peerId: string) {
    const room = this.roomRepository.findOneByPeerId(peerId);

    if (!room) {
      return;
    }

    if (room && !room.state) {
      this.roomApiAdapter.playerQuit(room.gameMode, room.roomId, peerId);
    }

    if (room.host === peerId) {
      if (room.players.length < 2) {
        this.roomRepository.deleteByRoomId(room.roomId);
        return;
      }

      this.roomRepository.updateHostByRoomId(room.roomId, room.players[1]);
    }

    this.roomRepository.deletePlayerofRoomByPeerId(peerId);

    const players = this.roomApiAdapter.getAllPlayer();

    this.roomEventEmitter = new RoomEventAdapter(room?.roomId as string);

    this.roomEventEmitter.quitPlayer({
      roomId: room.roomId as string,
      players: room.players.map((peerId) => {
        const player = players.find((player) => {
          return player.peerId === peerId;
        }) as Player;

        return {
          peerId: player.peerId,
          userName: player.userName,
          avataURL: player.avata,
          isHost: player.peerId === room.host,
          isMicOn: player.isMicOn,
        };
      }),
    });

    // console.log({
    //   roomId: room?.roomId,
    //   players: players.map((player) => {
    //     if (room?.players.includes(player.peerId)) {
    //       return {
    //         peerId: player.peerId,
    //         userName: player.userName,
    //         avataURL: player.avata,
    //         isHost: player.peerId === room?.host,
    //         isMicOn: player.isMicOn,
    //       };
    //     }
    //   }),
    // });

    return;
  }
  gameStart(peerId: string, gameMode: GAME_MODE) {
    const room = this.checkHostByPeerId(peerId);
    if (room) {
      this.roomRepository.updateGameModeByRoomId(room.roomId, gameMode);

      // 게임이 시작하면 못들어오게 막기
      this.roomRepository.updateStateByRoomId(room.roomId, false);

      // 게임시작 신호 보내기(game한테)
      this.roomApiAdapter.gameStart(
        room.roomId,
        gameMode,
        room.players,
        room.totalRound,
        room.roundTime,
        room.goalScore
      );

      // console.log({
      //   roomId: room.roomId,
      //   gameMode,
      // });
      // console.log(room);
    }

    return;
  }
  chooseMode(peerId: string, gameMode: GAME_MODE) {
    const room = this.checkHostByPeerId(peerId);
    if (room) {
      this.roomRepository.updateGameModeByRoomId(room.roomId, gameMode);

      this.roomEventEmitter = new RoomEventAdapter(room.roomId);

      // 방에 있는 모든 사람에게 게임 모드 알려주기
      this.roomEventEmitter.modeChange({
        roomId: room.roomId,
        gameMode: gameMode,
      });
    }
    return;
  }

  checkHostByPeerId(peerId: string) {
    const room = this.roomRepository.findOneByPeerId(peerId);

    if (room) {
      if (room.host === peerId) {
        // 호스트만 가능
        return room;
      }
    }
    console.log("방 없거나 권한 없음");

    return undefined;
  }

  chatting(peerId: string, message: string) {
    const room = this.roomRepository.findOneByPeerId(peerId);
    if (room) {
      this.roomApiAdapter.chatting(peerId, room.roomId, message);
    }

    return;
  }

  endGame(roomId: string) {
    const room = this.roomRepository.findOneByRoomId(roomId);
    if (room) {
      this.roomRepository.updateStateByRoomId(room.roomId, true);
    }
    return;
  }
}
