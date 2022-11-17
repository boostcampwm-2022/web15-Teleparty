import { useEffect, useRef } from "react";

import { useAtom } from "jotai";

import { CanvasLayout } from "./Canvas.styles";
import { findEdgePoints } from "./utils/canvas";
import Ellipse from "./utils/Ellipse";
import Line from "./utils/Line";
import Polygon from "./utils/Polygon";
import Rectangle from "./utils/Rectangle"
import Shape from "./utils/Shape";
import straightLine from "./utils/StraightLine";

import { toolAtom } from "../../store/tool";
import { getCoordRelativeToElement } from "../../utils/coordinate";
import { debounceByFrame } from "../../utils/debounce";

const CANVAS_PROPS = {
  WIDTH: 1036,
  HEIGHT: 644,
};

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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
    for (const shape of shapeList.current) {
      ctx && shape.draw(ctx);
    }
  });

  const drawStart: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const currentPoint = getCoordRelativeToElement(
      event.clientX,
      event.clientY,
      event.target as Element
    );

		if (tool === "fill") {
			if (!canvasRef.current) return;
			const polygon = new Polygon("#aa22aa", 1, 10, findEdgePoints(canvasRef.current, currentPoint));
			shapeList.current.push(polygon);
			drawAllShapes();
			return;
		}

    const shapeCreateFunctionMap = {
      pen: () => new Line("#aa22aa", 1, 10),
      fill: () => new Line("#ffffff", 1, 10),
      circle: () => new Ellipse("#aa22aa", 1, 10, currentPoint),
      erase: () => new Line("#ffffff", 1, 10),
      straightLine: () => new straightLine("#aa22aa", 1, 10, currentPoint),
      rectangle: () => new Rectangle("#aa22aa", 1, 10, currentPoint),
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
      target.pushPoint(currentPoint);
    } else if (target instanceof Rectangle) {
      target.point2 = currentPoint;
    } else if (target instanceof Ellipse) {
			target.point2 = currentPoint;
		} else if (target instanceof straightLine) {
			target.point2 = currentPoint;
		} 

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
