/**
 * 프레임 단위 디바운스가 적용된 함수를 반환합니다.
 * @param fn
 */
export const debounceByFrame = <Params extends any[]>(
  func: (...args: Params) => any
) => {
  let requestAnimationFrameId = 0;
  return (...args: Params) => {
    cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = requestAnimationFrame(() => {
      func(...args);
    });
  };
};
