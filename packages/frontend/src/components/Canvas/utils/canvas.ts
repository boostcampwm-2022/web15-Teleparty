import { Point } from "./Point";

interface CanvasContextSetting {
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  lineWidth?: number;
  globalAlpha?: number;
}

export const getCanvasContextSetting = (
  ctx: CanvasRenderingContext2D
): CanvasContextSetting => {
  const { fillStyle, strokeStyle, lineWidth, globalAlpha } = ctx;
  return { fillStyle, strokeStyle, lineWidth, globalAlpha };
};

export const setCanvasContextSetting = (
  ctx: CanvasRenderingContext2D,
  canvasSetting: CanvasContextSetting
): void => {
  const { fillStyle, strokeStyle, lineWidth, globalAlpha } = canvasSetting;

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
  }

  if (lineWidth !== undefined) {
    ctx.lineWidth = lineWidth;
  }

  if (globalAlpha !== undefined) {
    ctx.globalAlpha = globalAlpha > 1 ? 1 : globalAlpha;
  }
};

export const findEdgePoints = (
  canvas: HTMLCanvasElement,
  point: Point
): Point[] => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  const edgePoints = [];
  const pointStrSet = new Set();
  const stack: Point[] = [point];
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // dfs 방향
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // image data 의 특정 픽셀 접근용 유틸 함수
  const getColorIndicesForCoord = (x: number, y: number, width: number) => {
    const i = y * (width * 4) + x * 4;
    return [i, i + 1, i + 2, i + 3];
  };

  // iterative dfs
  while (stack.length) {
    const { x, y } = stack.pop()!;
    if (x < 0 || y < 0 || x > canvas.width - 1 || y > canvas.height - 1) {
      edgePoints.push({ x, y });
      continue;
    }

    const [r, g, b, a] = getColorIndicesForCoord(x, y, canvas.width);
    const isEmpty = data[r] + data[g] + data[b] + data[a] === 0;

    if (!isEmpty) {
      edgePoints.push({ x, y });
      continue;
    }

    for (const [dy, dx] of directions) {
      const pointStr = `${y + dy} ${x + dx}`;
      if (pointStrSet.has(pointStr)) {
        continue;
      }

      pointStrSet.add(pointStr);
      stack.push({
        x: x + dx,
        y: y + dy,
      });
    }
  }

  const getAngle = (point: Point, centerPoint: Point) =>
    (Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x) * 180) /
    Math.PI;

  // 시계 방향 정렬
  const sortedEdgePoints = edgePoints.sort(
    (p1, p2) => getAngle(p1, point) - getAngle(p2, point)
  );

  return sortedEdgePoints;
};
