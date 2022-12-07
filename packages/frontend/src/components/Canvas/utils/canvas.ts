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
