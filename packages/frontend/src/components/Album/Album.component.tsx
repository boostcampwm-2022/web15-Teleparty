import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAtomValue, useSetAtom } from "jotai";

import {
  AlbumLayout,
  AlbumNextButtonBox,
  AlbumNextLayout,
  AlbumNextText,
} from "./Album.styles";
import AlbumBubble from "./AlbumBubble.component";

import { CANVAS_SIZE } from "../../constants/canvas";
import useCreateGIF from "../../hooks/useCreateGIF";
import useGetUsername from "../../hooks/useUsername";
import { playersAtom } from "../../store/players";
import { socketAtom } from "../../store/socket";
import { Button } from "../common/Button";
import Icon from "../Icon/Icon";

import type { AlbumType } from "../../types/game";

const ALBUM_DELAY = 1000 * 2.5;

interface AlbumProps {
  album: AlbumType[];
  isLastAlbum: boolean;
}

interface AlbumWithAvatar extends AlbumType {
  avatarURL: string;
}

const Album = ({ album, isLastAlbum }: AlbumProps) => {
  const [renderedAlbum, setRenderedAlbum] = useState<AlbumWithAvatar[]>([]);
  const [showNext, setShowNext] = useState(false);
  const albumEndRef = useRef<HTMLDivElement>(null);
  const players = useAtomValue(playersAtom);
  const socket = useAtomValue(socketAtom);
  const navigate = useNavigate();
  const setPlayers = useSetAtom(playersAtom);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getUserNameById = useGetUsername();
  const onDownloadClick = useCreateGIF({
    album: renderedAlbum,
    ref: canvasRef,
  });

  const isHost =
    socket.id && players.find(({ isHost }) => isHost)?.peerId === socket.id;

  const getAvatarURLById = useCallback(
    (id: string) =>
      players.find(({ peerId }) => peerId === id)?.avatarURL ?? "",
    [players]
  );

  useEffect(() => {
    albumEndRef.current?.scrollIntoView();
  }, [showNext]);

  useEffect(() => {
    if (renderedAlbum.at(-1)?.keyword) {
      albumEndRef.current?.scrollIntoView();
    }
  }, [renderedAlbum]);

  useEffect(() => {
    setShowNext(false);
    const interval = setInterval(() => {
      const albumItem = album.shift();
      if (!albumItem) {
        clearInterval(interval);
        setShowNext(true);
        if (isLastAlbum) {
          setPlayers((prev) =>
            prev.map((player) => ({
              ...player,
              isReady: true,
              isCurrentTurn: false,
            }))
          );
        }
        return;
      }
      const newAlbumItem = {
        ...albumItem,
        avatarURL: getAvatarURLById(albumItem.peerId),
      };
      setRenderedAlbum((prev) => [...prev, newAlbumItem]);
    }, ALBUM_DELAY);

    return () => {
      setRenderedAlbum([]);
      clearInterval(interval);
    };
  }, [album, isLastAlbum, setPlayers, getAvatarURLById]);

  const onImageLoad = () => {
    albumEndRef.current?.scrollIntoView();
  };

  const onNextClick = () => {
    socket.emit("request-album");
  };

  const onGoRoomClick = () => {
    socket.emit("quit-game");
    navigate("/room", { replace: true });
  };

  return (
    <AlbumLayout>
      {renderedAlbum.map(({ peerId, img, keyword, avatarURL }, index) => (
        <AlbumBubble
          key={index}
          isRightSide={!img}
          username={getUserNameById(peerId) ?? ""}
          avatarURL={avatarURL}
        >
          {img ? (
            <img src={img} alt="result" width={450} onLoad={onImageLoad} />
          ) : (
            keyword
          )}
        </AlbumBubble>
      ))}
      {showNext && (
        <AlbumNextLayout>
          <AlbumNextText>
            {getUserNameById(renderedAlbum[0]?.peerId)}님의 앨범
          </AlbumNextText>
          <AlbumNextButtonBox>
            <Button variant="icon" onClick={onDownloadClick}>
              <Icon icon="download" size={36} />
            </Button>
            {isLastAlbum ? (
              <Button variant="large" onClick={onGoRoomClick}>
                방으로 이동
              </Button>
            ) : (
              isHost && (
                <Button variant="large" onClick={onNextClick}>
                  다음
                </Button>
              )
            )}
          </AlbumNextButtonBox>
        </AlbumNextLayout>
      )}
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE.WIDTH}
        height={CANVAS_SIZE.HEIGHT}
        hidden
      />
      <div ref={albumEndRef}></div>
    </AlbumLayout>
  );
};

export default Album;
