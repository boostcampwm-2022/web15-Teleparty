import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router";

import { useAtomValue, useSetAtom } from "jotai";

import {
  LobbyButtonBox,
  LobbyContentBox,
  LobbyLayout,
  LobbyRightContentBox,
} from "./Lobby.styles";

import Chat from "../../components/Chat/Chat.component";
import { Button } from "../../components/common/Button";
import GameModeSegmentedControl from "../../components/GameModeSegmentedControl/GameModeSegmentedControl.component";
import { Logo } from "../../components/Logo/Logo.component";
import PlayerList from "../../components/PlayerList/PlayerList.component";
import { GameMode, GAME_MODE_LIST } from "../../constants/game-mode";
import { gameInfoAtom } from "../../store/game";
import {
  playersAtom,
  isPlayerHost,
  isAllPlayerQuitFromGame,
  removePlayerAtom,
  quitPlayerFromGameAtom,
  addPlayerAtom,
  removePlayersGameDataAtom,
} from "../../store/players";
import { ratioAtom } from "../../store/ratio";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

import type { GameInfo, Player } from "../../types/game";

const Lobby = () => {
  const roomId = useAtomValue(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const players = useAtomValue(playersAtom);
  const removePlayersGameData = useSetAtom(removePlayersGameDataAtom);
  const addPlayer = useSetAtom(addPlayerAtom);
  const removePlayer = useSetAtom(removePlayerAtom);
  const quitPlayerFromGame = useSetAtom(quitPlayerFromGameAtom);
  const setGameInfo = useSetAtom(gameInfoAtom);
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>(GAME_MODE_LIST[0]);
  const ratio = useAtomValue(ratioAtom);

  const onInviteClick = () => {
    toast.dismiss();
    const inviteUrl = `${window.location.origin}/?invite=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success("초대 링크가 복사되었습니다.");
  };

  const isHost = isPlayerHost(players, socket.id);
  const onGameStartClick = () => {
    if (!isHost) return;
    if (!isAllPlayerQuitFromGame(players)) {
      toast.dismiss();
      toast.error("모든 플레이어가 방에 입장해야 합니다!");
    }
    socket.emit("game-start", { gameMode });
  };

  useEffect(() => {
    const gameStartListener = (gameStartResponse: GameInfo) => {
      setGameInfo(gameStartResponse);
      navigate("/room/game", { replace: true });
    };
    socket.on("game-start", gameStartListener);
    return () => {
      socket.off("game-start", gameStartListener);
    };
  }, [socket, navigate, setGameInfo]);

  useEffect(() => {
    const newJoinListener = (player: Player) => {
      addPlayer(player);
    };
    const playerQuitListener = ({ peerId }: { peerId: string }) => {
      removePlayer(peerId);
    };
    const quitGameListener = ({ peerId }: { peerId: string }) => {
      quitPlayerFromGame(peerId);
    };
    socket.on("new-join", newJoinListener);
    socket.on("player-quit", playerQuitListener);
    socket.on("quit-game", quitGameListener);
    return () => {
      socket.off("new-join", newJoinListener);
      socket.off("player-quit", playerQuitListener);
      socket.off("quit-game", quitGameListener);
    };
  }, [socket, addPlayer, quitPlayerFromGame, removePlayer]);

  useEffect(() => {
    removePlayersGameData();
  }, [removePlayersGameData]);

  return roomId === undefined ? (
    <Navigate to="/" replace />
  ) : (
    <>
      <Toaster />
      <LobbyLayout ratio={ratio}>
        <div>
          <Logo height={100} />
        </div>
        <LobbyContentBox>
          <PlayerList maxPlayer={10} sizeType="large" />
          <LobbyRightContentBox>
            <GameModeSegmentedControl
              selectedGameMode={gameMode}
              setSelectedGameMode={setGameMode}
              disabled={!isHost}
            />
            <LobbyButtonBox>
              <Button variant="medium" onClick={onInviteClick}>
                초대
              </Button>
              <Button
                variant="medium"
                onClick={onGameStartClick}
                disabled={!isHost}
              >
                게임시작
              </Button>
            </LobbyButtonBox>
            <Chat variant="horizontal" />
          </LobbyRightContentBox>
        </LobbyContentBox>
      </LobbyLayout>
    </>
  );
};

export default Lobby;
