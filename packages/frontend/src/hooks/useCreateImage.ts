import { toast } from "react-hot-toast";

import { CANVAS_SIZE } from "../constants/canvas";
import { getCurrentDateTimeFormat } from "../utils/date";

interface CreateImageArguments {
  originalCanvas: HTMLCanvasElement | null;
  targetCanvas: HTMLCanvasElement | null;
  keyword: string;
}

const KEYWORD_OFFSET = {
  RECT: { WIDTH: 20, HEIGHT: 10 },
  TEXT: { WIDTH: 10, HEIGHT: 40 },
};

const useCreateImage = ({
  targetCanvas,
  originalCanvas,
  keyword,
}: CreateImageArguments) => {
  const onDownloadClick = () => {
    const targetCanvasContext = targetCanvas?.getContext("2d");
    if (!originalCanvas || !targetCanvas || !targetCanvasContext) return;

    targetCanvasContext.drawImage(originalCanvas, 0, 0);

    targetCanvasContext.font = "bold 36px 'Noto Sans KR', sans-serif";
    targetCanvasContext.fillStyle = "white";
    const textSize = targetCanvasContext.measureText(keyword);
    targetCanvasContext.fillRect(
      0,
      0,
      textSize.width + KEYWORD_OFFSET.RECT.WIDTH,
      textSize.fontBoundingBoxAscent + KEYWORD_OFFSET.RECT.HEIGHT
    );

    targetCanvasContext.fillStyle = "black";
    targetCanvasContext.fillText(
      keyword,
      KEYWORD_OFFSET.TEXT.WIDTH,
      KEYWORD_OFFSET.TEXT.HEIGHT
    );

    const url = targetCanvasContext.canvas.toDataURL();
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Teleparty_${keyword}_${getCurrentDateTimeFormat()}.png`;
    anchor.click();
    targetCanvasContext.clearRect(0, 0, CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);
    toast.success("다운로드가 완료되었습니다.");
  };
  return onDownloadClick;
};

export default useCreateImage;
