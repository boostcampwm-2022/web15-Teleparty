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

    const dy = point.y - prevPoint.y;
    const dx = point.x - prevPoint.x;
    // 같은 위치에 점이 찍힌경우 무시
    if (dy === 0 && dx === 0) return;

    const prevDy = prevPoint.y - prevPrevPoint.y;
    const prevDx = prevPoint.x - prevPrevPoint.x;

    const theta = Math.atan2(dy, dx);
    const prevTheta = Math.atan2(prevDy, prevDx);

    // 이전 점들과 유사한 각도인 경우, 점을 추가하지 않고 바로 이전 점을 업데이트
    if (Math.abs(prevTheta - theta) < 0.001) {
      prevPoint.x = point.x;
      prevPoint.y = point.y;
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
  }
}
