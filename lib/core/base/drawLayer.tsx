import { CellTypeEnum, renderCellProps } from '../../interfaces';
import BaseEvent from '../../plugins/event';
import { scope } from '../../plugins/EventStack';
import { isNN } from '../../utils';

function clipCell(ctx: CanvasRenderingContext2D, position: scope, renderFunc: () => void) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(...position);
  ctx.clip();
  renderFunc();
  ctx.restore();
}

export default class DrawLayer extends BaseEvent {
  protected ctx: CanvasRenderingContext2D | null;
  protected canvasDom: HTMLCanvasElement | null;
  protected components: Partial<Record<keyof CellTypeEnum, (ctx: CanvasRenderingContext2D, data: renderCellProps) => void>>

  constructor() {
    super();

    this.ctx = null;
    this.canvasDom = null;
    this.components = {};
    this.handleDefaultComponents();
  }

  protected handleDefaultComponents() {
    this.components[CellTypeEnum.string] = (ctx: CanvasRenderingContext2D, data: renderCellProps) => {
      const {
        point,
        cell,
        w,
        h
      } = data;

      this.initStrokeStyle(ctx);
      ctx.fillStyle = cell.style.backgroundColor || '#FFFFFF';
      if (!isNN(cell.style.backgroundColor)) {
        ctx.fillRect(point[0], point[1], w, h);
      }

      if (cell.content === '') {
        return;
      }
      const size = cell.style.fontSize || 12;
      ctx.font = `${size}px ${cell.style.font || 'Arial'}`;
      ctx.fillStyle = cell.style.fontColor || '#000000';
      ctx.textAlign = 'left';
      let left = point[0];
      if (cell.style.align) {
        switch (cell.style.align) {
          case 'center':
            ctx.textAlign = 'center';
            left += w / 2;
            break;
          case 'left':
            ctx.textAlign = 'left';
            break;
          case 'right':
            ctx.textAlign = 'right';
            left += w;
            break;
          default: break;
        }
      }

      clipCell(
        ctx,
        [point[0], point[1], w, h],
        () => {
          ctx.fillText(cell.content, left, point[1] + h / 2 + size / 2);
        }
      )
    }
  }

  private initStrokeStyle(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#b5b5b5'
    ctx.lineWidth = 1;
  }

  private drawBorder(props: renderCellProps) {
    if (!this.ctx) {
      return;
    }
    this.initStrokeStyle(this.ctx);
    this.ctx.strokeRect(props.point[0], props.point[1], props.w, props.h);
  }

  protected drawLine(point_1: [number, number], point_2: [number, number]) {
    if (!this.ctx) {
      return;
    }
    this.ctx.beginPath();
    this.initStrokeStyle(this.ctx);
    this.ctx.moveTo(...point_1);
    this.ctx.lineTo(...point_2);
    this.ctx.stroke();
  }

  protected drawCell(props: renderCellProps, needBorder = false) {
    if (!this.ctx) {
      return;
    }
    const renderFunc = this.components[props.cell.type];
    renderFunc && renderFunc(this.ctx, props);

    needBorder && this.drawBorder(props);
  }
}