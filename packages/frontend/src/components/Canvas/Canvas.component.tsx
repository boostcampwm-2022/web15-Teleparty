import { SetStateAction, useEffect, useRef } from "react";

import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";

import { CanvasLayout } from "./Canvas.styles";
import { findEdgePoints } from "./utils/canvas";
import Ellipse from "./utils/Ellipse";
import Line from "./utils/Line";
import Polygon from "./utils/Polygon";
import Rectangle from "./utils/Rectangle";
import Shape from "./utils/Shape";
import straightLine from "./utils/StraightLine";

import { thicknessAtom } from "../../store/thickness";
import { toolAtom, paletteAtom } from "../../store/tool";
import { transparencyAtom } from "../../store/transparency";
import { getCoordRelativeToElement } from "../../utils/coordinate";
import { debounceByFrame } from "../../utils/debounce";

const CANVAS_SIZE = {
  WIDTH: 1036,
  HEIGHT: 644,
};

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setOutgoingCanvasStream: React.Dispatch<SetStateAction<MediaStream | null>>;
}

const Canvas = ({ canvasRef, setOutgoingCanvasStream }: CanvasProps) => {
  const canvasImageData = useRef<ImageData | null>(null);
  const shapeList = useRef<Shape[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [tool] = useAtom(toolAtom);
  const [transparency] = useAtom(transparencyAtom);
  const [color] = useAtom(paletteAtom);
  const thickness = useAtomValue(thicknessAtom);

  useEffect(() => {
    if (!canvasRef.current) return;
    setOutgoingCanvasStream(canvasRef.current.captureStream());

    return () => {
      setOutgoingCanvasStream(null);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
  }, [canvasRef]);

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvasImageData.current = imageData;
  };

  const drawAllShapes = debounceByFrame(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw saved image to canvas
    if (canvasImageData.current) {
      ctx.putImageData(canvasImageData.current, 0, 0);
    } else {
      // draw all shapes
      for (const shape of shapeList.current) {
        shape.draw(ctx);
      }
    }

    // draw drawing shape to canvas
    if (canvasImageData.current && isDrawing) {
      shapeList.current.at(-1)?.draw(ctx);
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
      const polygon = new Polygon(
        color,
        transparency,
        10,
        findEdgePoints(canvasRef.current, currentPoint)
      );
      shapeList.current.push(polygon);
      drawAllShapes();
      return;
    }

    const shapeCreateFunctionMap = {
      pen: () => new Line(color, transparency, thickness * 16),
      fill: () => new Line(color, transparency, thickness * 16),
      circle: () =>
        new Ellipse(color, transparency, thickness * 16, currentPoint),
      erase: () => new Line("#ffffff", 1, thickness * 16),
      straightLine: () =>
        new straightLine(color, transparency, thickness * 16, currentPoint),
      rectangle: () =>
        new Rectangle(color, transparency, thickness * 16, currentPoint),
    };
    shapeList.current.push(shapeCreateFunctionMap[tool]());
    isDrawing.current = true;
    captureCanvas();
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
      ctx?.clearRect(0, 0, CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);
      canvasImageData.current = null;
      drawAllShapes();
    }
  };

  return (
    <CanvasLayout
      width={CANVAS_SIZE.WIDTH}
      height={CANVAS_SIZE.HEIGHT}
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
