export function judgeOuter(cW: number, cH: number, x: number, y: number, w: number, h: number) {
  return x > cW || y > cH || x + w < 0 || y + h < 0;
}