import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import gifshot from "gifshot";
import { useAtomValue, useSetAtom } from "jotai";

import {
  AlbumLayout,
  AlbumNextButtonBox,
  AlbumNextLayout,
  AlbumNextText,
} from "./Album.styles";
import AlbumBubble from "./AlbumBubble.component";

import { CANVAS_SIZE } from "../../constants/canvas";
import { playersAtom } from "../../store/players";
import { socketAtom } from "../../store/socket";
import { getCurrentDateTimeFormat } from "../../utils/date";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const onNextClick = () => {
    socket.emit("request-album");
  };

  const onGoRoomClick = () => {
    socket.emit("quit-game");
    navigate("/room", { replace: true });
  };

  const onDownloadClick = async () => {
    const canvas = canvasRef.current;
    const context = canvasRef.current?.getContext("2d");
    if (!canvas || !context || !renderedAlbum.length) {
      toast.dismiss();
      toast.error("다운로드에 실패했습니다.");
      return;
    }

    const drawUsername = (peerId: string) => {
      const username = getUserNameById(peerId) ?? "";
      context.font = "bold 36px 'Noto Sans KR', sans-serif";
      context.textAlign = "center";
      const textSize = context.measureText(username);
      context.fillStyle = "white";
      context.fillRect(
        canvas.width / 2 - textSize.actualBoundingBoxLeft - 5,
        canvas.height * 0.95 - textSize.actualBoundingBoxAscent - 5,
        textSize.width + 10,
        textSize.actualBoundingBoxAscent +
          textSize.actualBoundingBoxDescent +
          10
      );
      context.fillStyle = "black";
      context.fillText(username, canvas.width / 2, canvas.height * 0.95);
    };
    const drawKeyword = (keyword: string) => {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "black";
      context.font = "bold 48px 'Noto Sans KR', sans-serif";
      context.textAlign = "center";
      context.fillText(keyword ?? "", canvas.width / 2, canvas.height / 2);
    };

    const imagePromises = renderedAlbum.map(({ peerId, img, keyword }) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (img) {
        return new Promise<string>((resolve) => {
          const image = new Image();
          image.onload = () => {
            context.drawImage(image, 0, 0);
            drawUsername(peerId);
            resolve(canvas.toDataURL() ?? "");
          };
          image.src = img;
        });
      }
      drawKeyword(keyword ?? "");
      drawUsername(peerId);
      const image = canvas.toDataURL();
      context.clearRect(0, 0, canvas.width, canvas.height);
      return new Promise<string>((resolve) => resolve(image));
    });
    const images = await Promise.all(imagePromises);
    const options = {
      images,
      interval: 2,
      gifWidth: canvas.width,
      gifHeight: canvas.height,
    };
    gifshot.createGIF(options, ({ image }) => {
      const a = document.createElement("a");
      a.href = image;
      a.download = `Teleparty_album_${getCurrentDateTimeFormat()}.gif`;
      a.click();
      toast.success("다운로드가 완료되었습니다.");
    });
  };

  return (
    <AlbumLayout>
      {renderedAlbum.map(({ peerId, img, keyword }, index) => (
        <AlbumBubble
          key={index}
          isRightSide={!img}
          username={getUserNameById(peerId) ?? ""}
        >
          {img ? <img src={img} alt="result" width={460} /> : keyword}
        </AlbumBubble>
      ))}
      {showNext && (
        <AlbumNextLayout>
          <AlbumNextText>OOO님의 앨범</AlbumNextText>
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
