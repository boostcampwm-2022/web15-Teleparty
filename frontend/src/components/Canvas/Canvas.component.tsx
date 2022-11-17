import { useEffect, useRef } from "react";

import { CanvasLayout } from "./Canvas.styles";
import Line from "./utils/Line";
import { Point } from "./utils/Point";
import Shape from "./utils/Shape";

import { getCoordRelativeToElement } from "../../utils/coordinate";

const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const shapeList = useRef<Shape[]>([]);
	const isDrawing = useRef<boolean>(false);

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

	const drawStart: React.MouseEventHandler<HTMLCanvasElement> = () => {
		shapeList.current.push(new Line("#aa22aa", 1, 10));
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
  }

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
