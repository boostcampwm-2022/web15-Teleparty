import { getCanvasContextSetting, setCanvasContextSetting } from "./canvas";
import { Point } from "./Point";
import Shape from "./Shape";

export default class Ellipse extends Shape {
  public point1: Point;
  public point2: Point;

  constructor(
    color: string,
    transparency: number,
    lineWidth: number,
    startPoint: Point
  ) {
    super(color, transparency, lineWidth);
    this.point1 = { ...startPoint };
    this.point2 = { ...startPoint };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const prevCtxSetting = getCanvasContextSetting(ctx);
    setCanvasContextSetting(ctx, {
      strokeStyle: this.color,
      lineWidth: this.lineWidth,
      globalAlpha: this.transparency,
    });

    const x = Math.min(this.point1.x, this.point2.x); 
    const y = Math.min(this.point1.y, this.point2.y); 
    const radiusX = Math.abs(this.point1.x - this.point2.x) / 2; 
    const radiusY = Math.abs(this.point1.y - this.point2.y) / 2; 

    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);

    setCanvasContextSetting(ctx, prevCtxSetting);
  }
}
