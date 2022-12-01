import { useEffect, useRef } from "react";

import { VideoLayout } from "./Video.styles";

interface VideoProps {
  srcObject: MediaProvider | null;
}

const Video = ({ srcObject }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = srcObject;
  }, [srcObject]);

  return <VideoLayout ref={videoRef} autoPlay />;
};

export default Video;
