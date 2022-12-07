import { SetStateAction, useEffect, useRef } from "react";

import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { DataConnection } from "peerjs";

import { CanvasLayout } from "./Canvas.styles";
import { findEdgePoints } from "./utils/canvas";
import Ellipse from "./utils/Ellipse";
import Line from "./utils/Line";
import { Point } from "./utils/Point";
import Polygon from "./utils/Polygon";
import Rectangle from "./utils/Rectangle";
import Shape from "./utils/Shape";
import straightLine from "./utils/StraightLine";

import { CANVAS_SIZE } from "../../constants/canvas";
import { thicknessAtom } from "../../store/thickness";
import { toolAtom, paletteAtom, Tool } from "../../store/tool";
import { transparencyAtom } from "../../store/transparency";
import { getCoordRelativeToElement } from "../../utils/coordinate";
import { debounceByFrame } from "../../utils/debounce";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  readonly?: boolean;
  dataConnections: DataConnection[];
}

const Canvas = ({
  canvasRef,
  readonly = false,
  dataConnections,
}: CanvasProps) => {
  const canvasImageData = useRef<ImageData | null>(null);
  const shapeList = useRef<Shape[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [tool] = useAtom(toolAtom);
  const [transparency] = useAtom(transparencyAtom);
  const [color] = useAtom(paletteAtom);
  const thickness = useAtomValue(thicknessAtom);
  console.log("dc: ", dataConnections);

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
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  const drawStart = (
    x: number,
    y: number,
    tool: Tool,
    color: string,
    transparency: number,
    lineWidth: number
  ) => {
    const point: Point = { x, y };

    if (tool === "fill") {
      if (!canvasRef.current) return;
      const polygon = new Polygon(
        color,
        transparency,
        10,
        findEdgePoints(canvasRef.current, point)
      );
      shapeList.current.push(polygon);
      drawAllShapes();
      return;
    }

    const shapeCreateFunctionMap = {
      pen: () => new Line(color, transparency, lineWidth),
      fill: () => new Line(color, transparency, lineWidth),
      circle: () => new Ellipse(color, transparency, lineWidth, point),
      erase: () => new Line("#ffffff", 1, lineWidth),
      straightLine: () =>
        new straightLine(color, transparency, lineWidth, point),
      rectangle: () => new Rectangle(color, transparency, lineWidth, point),
    };
    shapeList.current.push(shapeCreateFunctionMap[tool]());
    isDrawing.current = true;

    captureCanvas();
    draw(x, y);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing.current) return;

    const target = shapeList.current.at(-1);
    const point: Point = { x, y };

    if (target instanceof Line) {
      target.pushPoint(point);
    } else if (target instanceof Rectangle) {
      target.point2 = point;
    } else if (target instanceof Ellipse) {
      target.point2 = point;
    } else if (target instanceof straightLine) {
      target.point2 = point;
    }

    drawAllShapes();
  };

  const drawEnd = () => {
    isDrawing.current = false;
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    shapeList.current.pop();
    canvasImageData.current = null;
    drawAllShapes();
  };

  useEffect(() => {
    console.log("useEffect event 등록 called");
    for (const dataConnection of dataConnections) {
      console.log("dataConnection에 등록!");
      dataConnection.on("data", (data) => {
        console.log(data);
      });
    }
  }, []);

  const mouseDownHandler: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    const point = getCoordRelativeToElement(
      event.clientX,
      event.clientY,
      event.target as Element
    );

    drawStart(point.x, point.y, tool, color, transparency, thickness * 16);
  };

  const mouseMoveHandler: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    const point = getCoordRelativeToElement(
      event.clientX,
      event.clientY,
      event.target as Element
    );

    draw(point.x, point.y);
  };

  const mouseUpHandler: React.MouseEventHandler<HTMLCanvasElement> = () => {
    drawEnd();
  };

  const keyDownHandler: React.KeyboardEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "z") {
      undo();
    }
  };

  return (
    <CanvasLayout
      width={CANVAS_SIZE.WIDTH}
      height={CANVAS_SIZE.HEIGHT}
      ref={canvasRef}
      onMouseDown={readonly ? undefined : mouseDownHandler}
      onMouseMove={readonly ? undefined : mouseMoveHandler}
      onMouseUp={readonly ? undefined : mouseUpHandler}
      onKeyDown={readonly ? undefined : keyDownHandler}
      tabIndex={1}
    />
  );
};

export default Canvas;
