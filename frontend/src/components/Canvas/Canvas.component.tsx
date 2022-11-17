import { useEffect, useRef } from "react";

import { useAtom } from "jotai";

import { CanvasLayout } from "./Canvas.styles";
import Line from "./utils/Line";
import { Point } from "./utils/Point";
import Shape from "./utils/Shape";

import { toolAtom } from "../../store/tool";
import { getCoordRelativeToElement } from "../../utils/coordinate";
import { debounceByFrame } from "../../utils/debounce";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeList = useRef<Shape[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [tool] = useAtom(toolAtom);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const drawAllShapes = debounceByFrame(() => {
    const ctx = canvasRef.current?.getContext("2d");
    for (const shape of shapeList.current) {
      ctx && shape.draw(ctx);
    }
  });

  const drawStart: React.MouseEventHandler<HTMLCanvasElement> = () => {
    const shapeCreateFunctionMap = {
      pen: () => new Line("#aa22aa", 1, 10),
      fill: () => new Line("#ffffff", 1, 10),
      circle: () => new Line("#ffffff", 1, 10),
      erase: () => new Line("#ffffff", 1, 10),
      straightLine: () => new Line("#ffffff", 1, 10),
      rectangle: () => new Line("#ffffff", 1, 10),
    };
    shapeList.current.push(shapeCreateFunctionMap[tool]());
    isDrawing.current = true;
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
      // 새로운 점을 추가
      target.pushPoint(currentPoint);
    }

    drawAllShapes();
  };

  const drawEnd: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    draw(event);
    isDrawing.current = false;
  };

  return (
    <CanvasLayout
      width={1036}
      height={644}
      ref={canvasRef}
      onMouseDown={drawStart}
      onMouseMove={draw}
      onMouseUp={drawEnd}
    />
  );
};

export default Canvas;
