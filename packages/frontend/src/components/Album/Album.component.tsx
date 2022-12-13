import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAtomValue, useSetAtom } from "jotai";

import {
  AlbumLayout,
  AlbumNextButtonBox,
  AlbumNextLayout,
  AlbumNextText,
} from "./Album.styles";
import AlbumBubble from "./AlbumBubble.component";

import {
  playersAtom,
  getPlayerNameById,
  isPlayerHost,
} from "../../store/players";
import { socketAtom } from "../../store/socket";
import { Button } from "../common/Button";
import Icon from "../Icon/Icon";

import type { AlbumType } from "../../types/game";

const ALBUM_DELAY = 1000 * 2.5;

interface AlbumProps {
  album: AlbumType[];
  isLastAlbum: boolean;
}

const Album = ({ album, isLastAlbum }: AlbumProps) => {
  const [renderedAlbum, setRenderedAlbum] = useState<AlbumType[]>([]);
  const [showNext, setShowNext] = useState(false);
  const albumEndRef = useRef<HTMLDivElement>(null);
  const players = useAtomValue(playersAtom);
  const socket = useAtomValue(socketAtom);
  const navigate = useNavigate();
  const setPlayers = useSetAtom(playersAtom);

  const isHost = isPlayerHost(players, socket.id);

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
      setRenderedAlbum((prev) => [...prev, albumItem]);
    }, ALBUM_DELAY);

    return () => {
      setRenderedAlbum([]);
      clearInterval(interval);
    };
  }, [album, isLastAlbum, setPlayers]);

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
      {renderedAlbum.map(({ peerId, img, keyword }, index) => (
        <AlbumBubble
          key={index}
          isRightSide={!img}
          username={getPlayerNameById(players, peerId) ?? ""}
        >
          {img ? (
            <img src={img} alt="result" width={460} onLoad={onImageLoad} />
          ) : (
            keyword
          )}
        </AlbumBubble>
      ))}
      {showNext && (
        <AlbumNextLayout>
          <AlbumNextText>
            {getPlayerNameById(players, renderedAlbum[0]?.peerId)}님의 앨범
          </AlbumNextText>
          <AlbumNextButtonBox>
            <Button variant="icon">
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
      <div ref={albumEndRef}></div>
    </AlbumLayout>
  );
};

export default Album;
