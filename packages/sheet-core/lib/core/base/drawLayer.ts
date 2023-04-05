import { CellTypeEnum, RenderCellPropsNoLocation, BaseSheetSetting } from '../../interfaces';
import BaseEvent, { EventConstant, ToolsEventConstant } from '../plugins/base/event';
import components from './cellComponents';

export type RectType = [number, number, number, number];

export function clipCell(ctx: CanvasRenderingContext2D, position: RectType, renderFunc: () => void) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(...position);
  ctx.clip();
  renderFunc();
  ctx.restore();
}

export enum ColorType {
  white = 'white',
  black = 'black',
  sideBar = 'sideBar',
  scrollBar = 'scrollBar',
  babfc3 = 'babfc3',
  line = 'line',
  gray = 'gray',
}

export const DarkColorSum: Record<ColorType, string> = {
  [ColorType.white]: '#0a0c0b',
  [ColorType.black]: '#ffffff',
  [ColorType.sideBar]: '#202121',
  [ColorType.scrollBar]: '#4f5150',
  [ColorType.babfc3]: '#3a3c3b',
  [ColorType.line]: '#313232',
  [ColorType.gray]: '#4f4f4f',
};

export const LightColorSum: Record<ColorType, string> = {
  [ColorType.white]: '#ffffff',
  [ColorType.black]: '#0a0c0b',
  [ColorType.sideBar]: '#f4f5f6',
  [ColorType.scrollBar]: '#dadada',
  [ColorType.babfc3]: '#babfc3',
  [ColorType.line]: '#dee0e2',
  [ColorType.gray]: '#d3d3d3',
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
    Record<CellTypeEnum, (_: this, ctx: CanvasRenderingContext2D, data: RenderCellPropsNoLocation) => void>
  >;
  constructor(config: BaseSheetSetting) {
    super();
    this.config = config;
    this.ctx = null;
    this.canvasDom = null;
    this.wrapperDom = config.dom instanceof HTMLElement ? config.dom : document.getElementById(config.dom);

    if (config.darkMode === 'auto') {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || false;
    } else {
      this.darkMode = Boolean(config.darkMode);
    }

    this._drawCellBorder = true;
    this.devMode = Boolean(config.devMode);
    this.components = components as any;
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

  public getColor(name: ColorType, needReverse: boolean = false) {
    if (this.darkMode && !needReverse) {
      return DarkColorSum[name] || '';
    }
    return LightColorSum[name] || '';
  }

  public initStrokeStyle(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.getColor(ColorType.line);
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
      renderFunc(this, this.ctx, props);
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
      renderFunc(this, this.ctx, props);
    }

    // 绘制左上角的小三角
    this.ctx.fillStyle = this.getColor(ColorType.babfc3);
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
