import { useEffect, useRef } from "react";

import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { DataConnection } from "peerjs";

import { CanvasLayout } from "./Canvas.styles";
import Ellipse from "./utils/Ellipse";
import FillShape from "./utils/FillShape";
import Line from "./utils/Line";
import Rectangle from "./utils/Rectangle";
import Shape from "./utils/Shape";
import straightLine from "./utils/StraightLine";
import {
  CanvasEventType,
  DrawStartParameter,
  DrawParameter,
  CanvasEvent,
} from "./utils/types";

import { CANVAS_SIZE } from "../../constants/canvas";
import { ratioAtom } from "../../store/ratio";
import { thicknessAtom } from "../../store/thickness";
import { toolAtom, paletteAtom } from "../../store/tool";
import { transparencyAtom } from "../../store/transparency";
import { debounceByFrame } from "../../utils/debounce";
import { throttle } from "../../utils/throttle";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  readonly?: boolean;
  dataConnections?: DataConnection[];
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
  const ratio = useAtomValue(ratioAtom);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
  }, [canvasRef, ratio]);

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

  const redrawAllShapes = debounceByFrame(() => {
    canvasImageData.current = null;
    drawAllShapes();
  });

  const drawStart = ({
    point,
    tool,
    color,
    transparency,
    lineWidth,
  }: DrawStartParameter) => {
    captureCanvas();

    if (tool === "fill") {
      const ctx = canvasRef.current?.getContext("2d");
      if (!canvasRef.current || !ctx) return;
      const fillShape = new FillShape(color, transparency, 0, point);
      fillShape.draw(ctx);
      shapeList.current.push(fillShape);

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

    draw({ point });
  };

  const draw = ({ point }: DrawParameter) => {
    const target = shapeList.current.at(-1);

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

    shapeList.current.pop();
    redrawAllShapes();
  };

  const sendDataToAllConnections = (event: CanvasEventType, data?: unknown) => {
    if (!dataConnections) return;

    for (const dataConnection of dataConnections) {
      dataConnection.send({ event, data });
    }
  };

  const dataEventHandler = (data: unknown) => {
    const { event, data: eventData } = data as CanvasEvent;

    switch (event) {
      case "canvas:draw-start":
        return drawStart(eventData as DrawStartParameter);
      case "canvas:draw":
        return draw(eventData as DrawParameter);
      case "canvas:draw-end":
        return drawEnd();
      case "canvas:undo":
        return undo();
    }
  };

  useEffect(() => {
    if (!dataConnections) return;

    for (const dataConnection of dataConnections) {
      dataConnection.on("data", dataEventHandler);
    }

    return () => {
      for (const dataConnection of dataConnections) {
        dataConnection.off("data", dataEventHandler);
      }
    };
  }, [dataConnections]);

  // 백그라운드에 있다 돌아왔을 때 그림을 복원한다
  // 백그라운드에 있을 때 캔버스에 그림이 그려지지 않아 해당 코드 작성
  useEffect(() => {
    const visibilityChangeListener = () => {
      if (!document.hidden) redrawAllShapes();
    };

    document.addEventListener("visibilitychange", visibilityChangeListener);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        visibilityChangeListener
      );
    };
  }, [redrawAllShapes]);

  const mouseDownHandler: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    const point = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    const drawStartArgument: DrawStartParameter = {
      point,
      tool,
      color,
      transparency,
      lineWidth: thickness * 16,
    };
    drawStart(drawStartArgument);
    sendDataToAllConnections("canvas:draw-start", drawStartArgument);
    isDrawing.current = true;
  };

  const mouseMoveHandler: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (!isDrawing.current) return;

    const point = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    const drawArgument: DrawParameter = { point };
    draw(drawArgument);
    sendDataToAllConnections("canvas:draw", drawArgument);
  };

  const mouseUpHandler: React.MouseEventHandler<HTMLCanvasElement> = () => {
    drawEnd();
    sendDataToAllConnections("canvas:draw-end");
    isDrawing.current = false;
  };

  const keyDownHandler: React.KeyboardEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (!((event.metaKey || event.ctrlKey) && event.key === "z")) return;

    undo();
    sendDataToAllConnections("canvas:undo");
  };

  useEffect(() => {
    drawAllShapes();
  }, [ratio, drawAllShapes]);

  return (
    <CanvasLayout
      width={CANVAS_SIZE.WIDTH}
      height={CANVAS_SIZE.HEIGHT}
      ref={canvasRef}
      onMouseDown={readonly ? undefined : mouseDownHandler}
      onMouseMove={
        readonly
          ? undefined
          : dataConnections && dataConnections.length
          ? throttle(mouseMoveHandler, 10)
          : mouseMoveHandler
      }
      onMouseUp={readonly ? undefined : mouseUpHandler}
      onKeyDown={readonly ? undefined : keyDownHandler}
      tabIndex={1}
    />
  );
};

export default Canvas;
