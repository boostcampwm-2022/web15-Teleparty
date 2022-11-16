import { useRef } from "react";

import { CanvasLayout } from "./Canvas.styles";
import Line from "./utils/Line";
import { Point } from "./utils/Point";
import Shape from "./utils/Shape";

import { getCoordRelativeToElement } from "../../utils/coordinate";

const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const shapeList = useRef<Shape[]>([]);
	const isDrawing = useRef<boolean>(false);
	const lastPoint = useRef<Point>({ x: 0, y: 0 });

	const drawAllShapes = () => {
		const ctx = canvasRef.current?.getContext("2d");
		for (const shape of shapeList.current) {
			ctx && shape.draw(ctx);
		}
	};

	const drawStart: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
		shapeList.current.push(new Line("#aa22aa", 1, 1));
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
