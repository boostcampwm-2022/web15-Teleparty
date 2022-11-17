import { getCanvasContextSetting, setCanvasContextSetting } from "./canvas";
import { Point } from "./Point";
import Shape from "./Shape";

export default class Line extends Shape {
  protected points: Point[] = [];

  pushPoint(point: Point) {
    const prevPoint = this.points.at(-1);
    const prevPrevPoint = this.points.at(-2);

    // 이전 점이 없을 시 그냥 push
    if (!prevPoint || !prevPrevPoint) {
      this.points.push(point);
      return;
    }

    // 이전 점들과 x좌표가 동일하면, 바로 이전 점의 y좌표만 변경
    if (point.x === prevPrevPoint.x && prevPoint.x === prevPrevPoint.x) {
      prevPoint.y = point.y;
      return;
    }

    // 이전 점들과 y좌표가 동일하면, 바로 이전 점의 x좌표만 변경
    if (point.y === prevPrevPoint.y && prevPoint.y === prevPrevPoint.y) {
      prevPoint.x = point.x;
      return;
    }

    // 이전 점들과 공통된 성분이 없을 경우, 그냥 push
    this.points.push(point);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const prevCtxSetting = getCanvasContextSetting(ctx);
    setCanvasContextSetting(ctx, {
      strokeStyle: this.color,
      lineWidth: this.lineWidth,
      globalAlpha: this.transparency,
    });

    ctx.beginPath(); 
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y); 
    }
    ctx.stroke(); 

    setCanvasContextSetting(ctx, prevCtxSetting);
    console.log(this.points.length);
  }
}
