import { useEffect, useRef, useState } from "react";

import { useAtomValue } from "jotai";

import {
  AlbumLayout,
  AlbumNextButtonBox,
  AlbumNextLayout,
  AlbumNextText,
} from "./Album.styles";
import AlbumBubble from "./AlbumBubble.component";

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

const Album = ({ album, isLastAlbum }: AlbumProps) => {
  const [renderedAlbum, setRenderedAlbum] = useState<AlbumType[]>([]);
  const [showNext, setShowNext] = useState(false);
  const albumEndRef = useRef<HTMLDivElement>(null);
  const players = useAtomValue(playersAtom);
  const socket = useAtomValue(socketAtom);

  const getUserNameById = (id: string) => {
    return players.find(({ peerId }) => peerId === id)?.userName;
  };

  const isHost =
    socket.id && players.find(({ isHost }) => isHost)?.peerId === socket.id;

  useEffect(() => {
    albumEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [renderedAlbum, showNext]);

  useEffect(() => {
    setShowNext(false);
    const interval = setInterval(() => {
      const albumItem = album.shift();
      if (!albumItem) {
        clearInterval(interval);
        setShowNext(true);
        return;
      }
      setRenderedAlbum((prev) => [...prev, albumItem]);
    }, ALBUM_DELAY);

    return () => {
      setRenderedAlbum([]);
      clearInterval(interval);
    };
  }, [album]);

  return (
    <AlbumLayout>
      {renderedAlbum.map(({ peerId, img, keyword }, index) => (
        <AlbumBubble
          key={index}
          isRightSide={!img}
          username={getUserNameById(peerId) ?? ""}
        >
          {img ? <img src={img} alt="result" /> : keyword}
        </AlbumBubble>
      ))}
      {showNext && (
        <AlbumNextLayout>
          <AlbumNextText>OOO님의 앨범</AlbumNextText>
          <AlbumNextButtonBox>
            <Button variant="icon">
              <Icon icon="download" size={36} />
            </Button>
            {isLastAlbum ? (
              <Button variant="large">방으로 이동</Button>
            ) : (
              isHost && <Button variant="large">다음</Button>
            )}
          </AlbumNextButtonBox>
        </AlbumNextLayout>
      )}
      <div ref={albumEndRef}></div>
    </AlbumLayout>
  );
};

export default Album;
