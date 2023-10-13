import { RenderCellPropsNoLocation } from '../../../interfaces';
import { PluginTypeEnum } from '../../plugins';
import Base from '../../base/base';
import { clipCell, ColorType } from '../../base/drawLayer';

export const render = function (_: Base, ctx: CanvasRenderingContext2D, data: RenderCellPropsNoLocation) {
  const { point, cell, w, h } = data;
  _.initStrokeStyle(ctx);
  ctx.fillStyle = cell.style.backgroundColor || _.getColor(ColorType.white);
  ctx.fillRect(point[0], point[1], w, h);

  if (cell.content === '') {
    return;
  }
  const img = _.getPlugin(PluginTypeEnum.ImageStackPlugin)?.getImage(cell.content);
  if (!img) {
    return;
  }
  clipCell(ctx, [point[0], point[1], w, h], () => {
    const { width, height } = img as HTMLImageElement;

    let _x = point[0];
    let _y = point[1];
    let _w, _h;
    if (w / h > width / height) {
      _h = h;
      _w = (h * width) / height;
      _x += w / 2 - _w / 2;
    } else {
      _w = w;
      _h = (w * height) / width;
      _y += (h - _h) / 2;
    }
    ctx.drawImage(img as CanvasImageSource, _x, _y, _w, _h);
  });
};
