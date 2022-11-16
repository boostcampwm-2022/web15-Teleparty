import Line from "./utils/Line";
import Shape from "./utils/Shape";
import { Point } from "./utils/Point";

import { CanvasLayout } from "./Canvas.styles";

import { useRef, useEffect } from "react";

const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const shapeList = useRef<Shape[]>([]);
	const isDrawing = useRef<boolean>(false);
	const lastPoint = useRef<Point>({ x: 0, y: 0 });


	useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;
		const l = new Line("#000000", 1);
		l.draw(ctx);
	}, []);

	const drawStart: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
		shapeList.current.push(new Line("#000000", 1));
		isDrawing.current = true;
		const { top, left } = (
			event.target as HTMLCanvasElement
		).getBoundingClientRect();
		lastPoint.current = {
			x: event.clientX - left,
			y: event.clientY - top,
		};
	};

	const drag: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!isDrawing.current) return;

		const target = shapeList.current.at(-1);
		if (target instanceof Line) {
			const { top, left } = (
				event.target as HTMLCanvasElement
			).getBoundingClientRect();
			const currentPoint = {
				x: event.clientX - left,
				y: event.clientY - top,
			};
      target.pushLine({
        start: lastPoint.current,
        end: currentPoint,
      })

      lastPoint.current = currentPoint;

      const ctx = canvasRef.current?.getContext("2d");
      for (const shape of shapeList.current) {
        ctx && shape.draw(ctx);
      }
		}
	};

	const drawEnd: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const target = shapeList.current.at(-1);
		if (target instanceof Line) {
			const { top, left } = (
				event.target as HTMLCanvasElement
			).getBoundingClientRect();
			const currentPoint = {
				x: event.clientX - left,
				y: event.clientY - top,
			};
      target.pushLine({
        start: lastPoint.current,
        end: currentPoint,
      })

      const ctx = canvasRef.current?.getContext("2d");
      for (const shape of shapeList.current) {
        ctx && shape.draw(ctx);
      }
		}
		isDrawing.current = false;
	};

	return (
		<CanvasLayout
			width={1036}
			height={644}
      ref={canvasRef}
			onMouseDown={drawStart}
			onMouseMove={drag}
			onMouseUp={drawEnd}
		/>
	);
};

export default Canvas;
