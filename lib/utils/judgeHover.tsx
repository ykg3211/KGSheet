export default function judgeOver([_x, _y], [x, y, w, h]) {
  return _x > x && _x < x + w && _y > y && _y < y + h;
}