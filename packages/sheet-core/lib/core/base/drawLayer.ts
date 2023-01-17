import { CellTypeEnum, RenderCellPropsNoLocation, Cell, BaseSheetSetting } from '../../interfaces';
import BaseEvent, { EventConstant, ToolsEventConstant } from '../plugins/base/event';
import { isNN } from '../../utils';
export type RectType = [number, number, number, number];

function clipCell(ctx: CanvasRenderingContext2D, position: RectType, renderFunc: () => void) {
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
  black: '#ffffff',
  sideBar: '#202121',
  scrollBar: '#4f5150',
  babfc3: '#3a3c3b',
  line: '#313232',
};

export const lightColorSum: colorType = {
  white: '#ffffff',
  black: '#0a0c0b',
  sideBar: '#f4f5f6',
  scrollBar: '#dadada',
  babfc3: '#babfc3',
  line: '#dee0e2',
};

export default class DrawLayer extends BaseEvent {
  public config: BaseSheetSetting;
  public ctx: CanvasRenderingContext2D | null;
  public canvasDom: HTMLCanvasElement | null;
  public wrapperDom: HTMLElement | null;

  public devMode: boolean; // 是不是调试模式
  public darkMode: boolean;
  public _drawCellBorder: boolean;
  protected components: Partial<
    Record<CellTypeEnum, (ctx: CanvasRenderingContext2D, data: RenderCellPropsNoLocation) => void>
  >;
  constructor(config: BaseSheetSetting) {
    super();
    this.config = config;
    this.ctx = null;
    this.canvasDom = null;
    this.wrapperDom = config.dom instanceof HTMLElement ? config.dom : document.getElementById(config.dom);
    this.components = {};

    if (config.darkMode === 'auto') {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || false;
    } else {
      this.darkMode = Boolean(config.darkMode);
    }

    this._drawCellBorder = true;
    this.devMode = Boolean(config.devMode);
    this.handleDefaultComponents();
    this.initMediaDarkMode();
  }

  private initMediaDarkMode() {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    media.addEventListener('change', (e) => {
      this.toggleDarkMode(e.matches || false);
    });
    this.toggleDarkMode(media.matches || false);
  }

  public get drawCellBorder() {
    return this._drawCellBorder;
  }
  public set drawCellBorder(v) {
    this._drawCellBorder = v;
    this.emit(ToolsEventConstant.TOGGLE_CELL_BORDER, v);
    this.emit(EventConstant.RENDER);
  }

  public toggleDarkMode(v?: boolean) {
    if (this.config.darkMode === 'auto') {
      this.darkMode = v === undefined ? !this.darkMode : v;
      this.emit(ToolsEventConstant.REFRESH);
      this.emit(EventConstant.DARK_MODE_CHANGE, this.darkMode);
      this.emit(EventConstant.RENDER);
    }
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
