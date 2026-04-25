export const nextTick = (fn: () => void) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
};
