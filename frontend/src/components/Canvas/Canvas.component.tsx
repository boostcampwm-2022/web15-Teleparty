import { useEffect, useRef } from "react";

import { CanvasLayout } from "./Canvas.styles";
import Line from "./utils/Line";
import { Point } from "./utils/Point";
import Shape from "./utils/Shape";

import { getCoordRelativeToElement } from "../../utils/coordinate";

const CANVAS_PROPS = {
  WIDTH: 1036,
  HEIGHT: 644,
};

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeList = useRef<Shape[]>([]);
  const isDrawing = useRef<boolean>(false);
  const lastPoint = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const drawAllShapes = () => {
    const ctx = canvasRef.current?.getContext("2d");
    for (const shape of shapeList.current) {
      ctx && shape.draw(ctx);
    }
  };

  const drawStart: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    shapeList.current.push(new Line("#aa22aa", 1, 10));
    isDrawing.current = true;
    lastPoint.current = getCoordRelativeToElement(
      event.clientX,
      event.clientY,
      event.target as Element
    );
  };

  const draw: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!isDrawing.current) return;

    const target = shapeList.current.at(-1);
    const currentPoint = getCoordRelativeToElement(
      event.clientX,
      event.clientY,
      event.target as Element
    );

    if (target instanceof Line) {
      // 새로운 선을 추가
      target.pushLine({
        start: lastPoint.current,
        end: currentPoint,
      });
    }

    lastPoint.current = currentPoint;
    drawAllShapes();
  };

  const drawEnd: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    draw(event);
    isDrawing.current = false;
  };

  const undo = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      const ctx = canvasRef.current?.getContext("2d");
      shapeList.current.pop();
      ctx?.clearRect(0, 0, CANVAS_PROPS.WIDTH, CANVAS_PROPS.HEIGHT);
      drawAllShapes();
    }
  };

  return (
    <CanvasLayout
      width={CANVAS_PROPS.WIDTH}
      height={CANVAS_PROPS.HEIGHT}
      ref={canvasRef}
      onMouseDown={drawStart}
      onMouseMove={draw}
      onMouseUp={drawEnd}
      onKeyDown={undo}
      tabIndex={1}
    />
  );
};

export default Canvas;
