import Base from '../../base/base';
import { RenderCellPropsNoLocation } from '../../../interfaces';
import { clipCell, ColorType } from '../../base/drawLayer';

export const render = function (_: Base, ctx: CanvasRenderingContext2D, data: RenderCellPropsNoLocation) {
  const { point, cell, w, h } = data;
  _.initStrokeStyle(ctx);
  ctx.fillStyle = cell.style.backgroundColor || _.getColor(ColorType.white);
  ctx.fillRect(point[0], point[1], w, h);

  if (cell.content === '') {
    return;
  }

  clipCell(ctx, [point[0], point[1], w, h], () => {
    const size = cell.style.fontSize || 12;
    ctx.font = `${cell.style.fontWeight || 'normal'} ${cell.style.italic ? 'italic' : ''} ${size}px ${cell.style.font || 'Arial'}`;
    ctx.fillStyle = '#3370FF';
    ctx.textAlign = 'left';
    let left = point[0];
    if (cell.style.textAlign) {
      ctx.textAlign = cell.style.textAlign;
      if (cell.style.textAlign === 'center') {
        left += w / 2;
      } else if (cell.style.textAlign === 'right') {
        left += w;
      }
    }

    let top = point[1] + h / 2;
    const contentWidth = ctx.measureText(cell.content).width;
    let _left = left;
    let _right = left;
    if (cell.style.textAlign === 'left') {
      _right += contentWidth;
    } else if (cell.style.textAlign === 'center') {
      _left -= contentWidth / 2;
      _right += contentWidth / 2;
    } else if (cell.style.textAlign === 'right') {
      _left -= contentWidth;
    }
    _left -= 3;
    _right += 3;

    if (cell.style.deleteLine) {
      ctx.beginPath();
      ctx.strokeStyle = cell.style.fontColor || _.getColor(ColorType.black);
      ctx.lineWidth = 1;
      ctx.moveTo(_left, top);
      ctx.lineTo(_right, top);
      ctx.stroke();
    }

    top += size / 2 - 2;
    ctx.beginPath();
    ctx.strokeStyle = '#3370FF';
    ctx.lineWidth = 1;
    ctx.moveTo(_left, top);
    ctx.lineTo(_right, top);
    ctx.stroke();

    ctx.fillText(cell.content, left, point[1] + h / 2 + size / 2 - 2);
  });
};
