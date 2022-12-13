import { memo, useEffect, useRef, useState } from "react";

import {
  MoonTimerLayout,
  MoonTimerCanvas,
  MoonTimerTimeParagraph,
} from "./MoonTimer.styles";

import ticktockAudioSrc from "../../assets/audio/tick-tock.mp3";
import { colors } from "../../global-styles/theme";

interface MoonTimerProps {
  secondTime: number;
  radius: number;
  gameState: string;
}

const MOON_TIMER_TICKTOCK_START_TIME = 10;

const MoonTimer = ({ secondTime, radius, gameState }: MoonTimerProps) => {
  const [remainSecondTime, setRemainSecondTime] = useState(secondTime);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(new Date());
  const requestAnimationFrameIdRef = useRef(0);
  const tickTockAudio = useRef(new Audio(ticktockAudioSrc));

  const remainMinute = Math.max(Math.floor(remainSecondTime / 60), 0);
  const remainSecond = Math.max(remainSecondTime - remainMinute * 60, 0);

  const getCanvasContext = () => {
    return canvasRef.current?.getContext("2d");
  };

  const initCanvas = () => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.fillStyle = colors.yellow;
  };

  const calculateElapsedSecond = () =>
    (new Date().getTime() - startTimeRef.current.getTime()) / 1000;

  // progress: 0 ~ 1
  const calculateProgress = () => {
    const elapsedSecond = calculateElapsedSecond();
    return elapsedSecond / secondTime;
  };

  const startTicktockSound = () => {
    if (!tickTockAudio.current.paused) return;

    tickTockAudio.current.play();
  };

  const stopTicktockSound = () => {
    if (tickTockAudio.current.paused) return;

    tickTockAudio.current.pause();
    tickTockAudio.current = new Audio(ticktockAudioSrc);
  };

  const requestAnimationFrameHandler = () => {
    const progress = calculateProgress();

    // set current second time to rerender time label
    const remainSecondTime = Math.ceil(secondTime - calculateElapsedSecond());
    setRemainSecondTime(remainSecondTime);

    // draw moon animation frame
    moonAnimationFrame(progress);

    if (
      remainSecondTime > 0 &&
      remainSecondTime <= MOON_TIMER_TICKTOCK_START_TIME
    )
      startTicktockSound();
    else stopTicktockSound();

    if (progress >= 1) return;
    requestAnimationFrameIdRef.current = requestAnimationFrame(
      requestAnimationFrameHandler
    );
  };

  const moonAnimationFrame = (progress: number) => {
    const ctx = getCanvasContext();
    if (!ctx) return;

    // draw right side
    ctx.beginPath();
    ctx.fillRect(radius, 0, radius, radius * 2);

    // halfWidth: -radius ~ radius
    const halfWidth = radius - radius * progress * 2;

    // progress가 0.5 미만인 경우, 가운데를 투명화, progress가 0.5 이상인 경우, 가운데를 칠한다.
    if (halfWidth > 0) ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.ellipse(radius, radius, Math.abs(halfWidth), radius, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
  };

  const startTimer = () => {
    startTimeRef.current = new Date();
    requestAnimationFrameIdRef.current = requestAnimationFrame(
      requestAnimationFrameHandler
    );
  };

  const stopTimer = () => {
    cancelAnimationFrame(requestAnimationFrameIdRef.current);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  useEffect(() => {
    startTimer();

    return () => {
      stopTimer();
      stopTicktockSound();
    };
  }, [gameState]);

  return (
    <MoonTimerLayout>
      <MoonTimerCanvas ref={canvasRef} width={radius * 2} height={radius * 2} />
      <MoonTimerTimeParagraph
        warning={remainSecondTime <= MOON_TIMER_TICKTOCK_START_TIME}
      >{`${remainMinute}:${remainSecond
        .toString()
        .padStart(2, "0")}`}</MoonTimerTimeParagraph>
    </MoonTimerLayout>
  );
};

export default memo(MoonTimer);
