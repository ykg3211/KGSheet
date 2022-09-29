export default function _throttleByRequestAnimationFrame(fn: Function, t: number = 0) {
  let flag = true;
  return () => {
    if (flag) {
      flag = false;
      fn();
      window.requestAnimationFrame(() => {
        flag = true;
      })
    }
  }
}