import { useEffect, useRef } from "react";

import { MoonTimerLayout } from "./MoonTimer.styles";

interface MoonTimerProps {
  secondTime: number;
  radius: number;
}

const MoonTimer = ({ secondTime, radius }: MoonTimerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(new Date());

  // progress: 0 ~ 1
  const calculateProgress = () => {
    const elapsedSecond =
      (new Date().getTime() - startTimeRef.current.getTime()) / 1000;
    return elapsedSecond / secondTime;
  };

  const moonAnimation = (ctx: CanvasRenderingContext2D) => {
    // draw right side
    ctx.beginPath();
    ctx.fillRect(radius, 0, radius, radius * 2);

    // draw ellipse to center
    const progress = calculateProgress();
    const halfWidth = radius - radius * progress * 2;

    // clear center by ellipse when progress < 0.5
    if (halfWidth > 0) ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.ellipse(radius, radius, Math.abs(halfWidth), radius, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    if (progress >= 1) return;
    requestAnimationFrame(() => moonAnimation(ctx));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "rgb(255, 236, 180)";

    moonAnimation(ctx);
  }, []);

  return (
    <MoonTimerLayout ref={canvasRef} width={radius * 2} height={radius * 2} />
  );
};

export default MoonTimer;
