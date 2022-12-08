export const throttle = <Params extends any[]>(
  func: (...args: Params) => any,
  time = 100
) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: Params) => {
    if (timer) return;
    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, time);
  };
};
