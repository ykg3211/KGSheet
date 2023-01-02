import { CellTypeEnum, RenderCellPropsNoLocation, Cell } from '../../interfaces';
import BaseEvent, { EventConstant } from '../plugins/base/event';
import { isNN } from '../../utils';
export type rectType = [number, number, number, number];

function clipCell(ctx: CanvasRenderingContext2D, position: rectType, renderFunc: () => void) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(...position);
  ctx.clip();
  renderFunc();
  ctx.restore();
}

export interface colorType {
  white: string;
  black: string;
  sideBar: string;
  scrollBar: string;
  babfc3: string;
  line: string;
}

export const darkColorSum: colorType = {
  white: '#0a0c0b',
  black: '#FFFFFF',
  sideBar: '#202121',
  scrollBar: '#4f5150',
  babfc3: '#3a3c3b',
  line: '#313232',
};

export const lightColorSum: colorType = {
  white: '#FFFFFF',
  black: '#0a0c0b',
  sideBar: '#f4f5f6',
  scrollBar: '#dadada',
  babfc3: '#babfc3',
  line: '#dee0e2',
};

export default class DrawLayer extends BaseEvent {
  public ctx: CanvasRenderingContext2D | null;
  public canvasDom: HTMLCanvasElement | null;
  protected components: Partial<
    Record<CellTypeEnum, (ctx: CanvasRenderingContext2D, data: RenderCellPropsNoLocation) => void>
  >;
  public darkMode: boolean;
  constructor() {
    super();

    this.ctx = null;
    this.canvasDom = null;
    this.components = {};
    this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || false;
    this.handleDefaultComponents();
  }

  // 是不是调试模式
  public get devMode() {
    return true;
  }

  public toggleDarkMode(v?: boolean) {
    this.darkMode = v === undefined ? !this.darkMode : v;
    this.emit(EventConstant.DARK_MODE_CHANGE);
    this.emit(EventConstant.RENDER);
  }

  public color(name: keyof colorType, needReverse: boolean = false) {
    if (this.darkMode && !needReverse) {
      return darkColorSum[name] || '';
    }
    return lightColorSum[name] || '';
  }

  protected handleDefaultComponents() {
    this.components[CellTypeEnum.text] = (ctx: CanvasRenderingContext2D, data: RenderCellPropsNoLocation) => {
      const { point, cell, w, h } = data;
      this.initStrokeStyle(ctx);
      ctx.fillStyle = cell.style.backgroundColor || this.color('white');
      ctx.fillRect(point[0], point[1], w, h);

      if (cell.content === '') {
        return;
      }

      clipCell(ctx, [point[0], point[1], w, h], () => {
        const size = cell.style.fontSize || 12;
        ctx.font = `${cell.style.fontWeight || 'normal'} ${cell.style.italic ? 'italic' : ''} ${size}px ${
          cell.style.font || 'Arial'
        }`;
        ctx.fillStyle = cell.style.fontColor || this.color('black');
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

        if (cell.style.underLine || cell.style.deleteLine) {
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
            ctx.strokeStyle = cell.style.fontColor || this.color('black');
            ctx.lineWidth = 1;
            ctx.moveTo(_left, top);
            ctx.lineTo(_right, top);
            ctx.stroke();
          }
          if (cell.style.underLine) {
            top += size / 2 - 2;
            ctx.beginPath();
            ctx.strokeStyle = cell.style.fontColor || this.color('black');
            ctx.lineWidth = 1;
            ctx.moveTo(_left, top);
            ctx.lineTo(_right, top);
            ctx.stroke();
          }
        }

        ctx.fillText(cell.content, left, point[1] + h / 2 + size / 2 - 2);
      });
    };
  }

  private initStrokeStyle(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.color('line');
    ctx.lineWidth = 1;
  }

  public drawRect(v: rectType) {
    if (!this.ctx) {
      return;
    }
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(...v);
  }

  private drawBorder(props: RenderCellPropsNoLocation) {
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

  protected drawCell(props: RenderCellPropsNoLocation, needBorder = false) {
    if (!this.ctx) {
      return;
    }
    const renderFunc = this.components[props.cell.type];
    if (renderFunc) {
      renderFunc(this.ctx, props);
    }
    if (needBorder) {
      this.drawBorder(props);
    }
  }

  protected drawLeftTopCell(props: RenderCellPropsNoLocation) {
    if (!this.ctx) {
      return;
    }
    //@ts-ignore
    const renderFunc = this.components[props.cell.type];
    if (renderFunc) {
      renderFunc(this.ctx, props);
    }

    // 绘制左上角的小三角
    this.ctx.fillStyle = this.color('babfc3');
    this.ctx.beginPath();
    const initPoint = [props.point[0] + props.w - 2, props.point[1] + props.h - 2];
    this.ctx.moveTo(initPoint[0], initPoint[1]);
    this.ctx.lineTo(initPoint[0], initPoint[1] - 10);
    this.ctx.lineTo(initPoint[0] - 10, initPoint[1]);
    this.ctx.moveTo(initPoint[0], initPoint[1]);
    this.ctx.fill();

    this.drawBorder(props);
  }
}
