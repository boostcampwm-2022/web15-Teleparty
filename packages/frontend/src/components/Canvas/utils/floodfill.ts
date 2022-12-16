interface PixelData {
  width: number;
  height: number;
  data: Uint32Array;
}

type SpanDirection = -1 | 0 | 1;

interface Span {
  left: number;
  right: number;
  y: number;
  direction: SpanDirection;
}

const getPixel = (pixelData: PixelData, x: number, y: number) => {
  if (x < 0 || y < 0 || x > pixelData.width || y > pixelData.height) {
    return -1;
  }

  return pixelData.data[y * pixelData.width + x];
};

export const floodFill = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  // canvas의 픽셀 정보 읽어오기
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  // fillColor 알아내기
  const targetColor = new Uint32Array(
    ctx.getImageData(x, y, 1, 1).data.buffer
  )[0];
  ctx.fillRect(x, y, 1, 1);
  const fillColor = new Uint32Array(
    ctx.getImageData(x, y, 1, 1).data.buffer
  )[0];

  // 이전 픽셀과 채우려는 픽셀이 같은 경우 작동 안함!
  if (targetColor === fillColor) return;

  // make a Uint32Array view on the pixels so we can manipulate pixels
  // r, g, b, a 1바이트씩 각각 접근하는 것보다, 4바이트 하나로 뭉쳐버린 후 접근하는게 반복을 25%로 줄일 수 있음.
  const pixelData = {
    width: imageData.width,
    height: imageData.height,
    data: new Uint32Array(imageData.data.buffer),
  };

  // stack
  const spansToCheck: Span[] = [];

  const addSpan = (
    left: number,
    right: number,
    y: number,
    direction: SpanDirection
  ) => {
    spansToCheck.push({ left, right, y, direction });
  };

  // left부터 right까지 스캔하면서, span을 수집한다.
  // 가로로 0 0 0 0 0 1 0 0 0 의 픽셀 데이터가 있을 때, (0 0 0 0 0)과 (0 0 0)의 정보를 얻어 내는 것.
  const checkSpan = (
    left: number,
    right: number,
    y: number,
    direction: SpanDirection
  ) => {
    let start: number | undefined;
    let x;

    // 오른쪽으로 이동하면서
    for (x = left; x < right; x++) {
      const color = getPixel(pixelData, x, y);

      if (color === targetColor) {
        // targetColor 처음 만났을 때
        if (!start) {
          // start를 현재 x로 설정해준다
          start = x;
        }
      } else {
        // targetColor가 아닌 경우
        // 이전에 targetColor를 만난적이 있는 경우 addSpan = span 하나 수집!
        if (start) {
          addSpan(start, x - 1, y, direction);
          start = 0;
        }
      }
    }

    // 이전에 targetColor를 만난적이 있는 경우 addSpan
    if (start) {
      addSpan(start, x - 1, y, direction);
    }
  };

  // 색깔을 감지할 때까지 x축 끝까지 이동
  const findSpanEdge = (x: number, y: number, direction: -1 | 1) => {
    // 범위 벗어난 경우 -1로 처리되어 무한루프의 가능성 없음
    while (getPixel(pixelData, x, y) === targetColor) {
      x += direction;
    }

    return x;
  };

  // 초기 위치
  addSpan(x, x, y, 0);

  // iterative dfs 시작
  while (spansToCheck.length > 0) {
    const span = spansToCheck.pop();
    if (!span) continue;
    const { left, right, y, direction } = span;

    // 좌, 우 끝까지 확장
    const leftEdge = findSpanEdge(left, y, -1) + 1;
    const rightEdge = findSpanEdge(right, y, 1) + 1;

    const lineOffset = y * pixelData.width;

    // 왼쪽, 오른쪽 끝까지 확장 시킨 l, r을 이용해 한번에 채우기(가로로 쭉)
    pixelData.data.fill(
      fillColor,
      lineOffset + leftEdge,
      lineOffset + rightEdge
    );

    if (direction <= 0) {
      checkSpan(leftEdge, rightEdge, y - 1, -1);
    } else {
      checkSpan(leftEdge, left, y - 1, -1);
      checkSpan(right, rightEdge, y - 1, -1);
    }

    if (direction >= 0) {
      checkSpan(leftEdge, rightEdge, y + 1, 1);
    } else {
      checkSpan(leftEdge, left, y + 1, 1);
      checkSpan(right, rightEdge, y + 1, 1);
    }
  }

  // 변경된 이미지 데이터를 다시 쓰기
  ctx.putImageData(imageData, 0, 0);
};
