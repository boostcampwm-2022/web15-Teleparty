import { toast } from "react-hot-toast";

import gifshot from "gifshot";

import useGetUsername from "./useUsername";

import { AlbumType } from "../types/game";
import { getCurrentDateTimeFormat } from "../utils/date";

interface CreateGIFArguments {
  album: AlbumType[];
  ref: React.RefObject<HTMLCanvasElement>;
}

const useCreateGIF = ({ album, ref }: CreateGIFArguments) => {
  const canvas = ref.current;
  const context = ref.current?.getContext("2d");
  const getUserNameById = useGetUsername();

  const drawUsername = (peerId: string) => {
    if (!canvas || !context) return;
    const username = getUserNameById(peerId);
    context.font = "bold 36px 'Noto Sans KR', sans-serif";
    context.textAlign = "center";
    const textSize = context.measureText(username);
    context.fillStyle = "white";
    context.fillRect(
      canvas.width / 2 - textSize.actualBoundingBoxLeft - 5,
      canvas.height * 0.95 - textSize.actualBoundingBoxAscent - 5,
      textSize.width + 10,
      textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent + 10
    );
    context.fillStyle = "black";
    context.fillText(username, canvas.width / 2, canvas.height * 0.95);
  };

  const drawKeyword = (keyword: string) => {
    if (!canvas || !context) return;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.font = "bold 48px 'Noto Sans KR', sans-serif";
    context.textAlign = "center";
    context.fillText(keyword ?? "", canvas.width / 2, canvas.height / 2);
  };

  const onDownloadGIF = async () => {
    console.log(canvas, context, album);
    if (!canvas || !context || !album || !album.length) {
      toast.dismiss();
      toast.error("다운로드에 실패했습니다.");
      return false;
    }
    const imagePromises = album.map(({ peerId, img, keyword }) => {
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
  return onDownloadGIF;
};

export default useCreateGIF;
