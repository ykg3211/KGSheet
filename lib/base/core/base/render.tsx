import { cell, excelConfig } from "../../../interfaces";
import BaseEvent from "../../plugins/event";
import createBaseConfig from "../baseConfig";



export default class Render extends BaseEvent {
  protected ctx: CanvasRenderingContext2D | null;
  protected canvasDom: HTMLCanvasElement | null;
  protected width: number; /** dom width */
  protected height: number; /** dom height */
  protected paddingTop: number;
  protected paddingLeft: number;
  protected contentWidth: number;
  protected contentHeight: number;
  protected _scale: number;

  private _data: excelConfig;
  private _scrollTop: number;
  private _scrollLeft: number;

  constructor() {
    super();
    this._scrollTop = 0;
    this._scrollLeft = 0;
    this.width = 0;
    this.height = 0;
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.paddingTop = 20;
    this.paddingLeft = 40;
    this._scale = 1;

    this._data = createBaseConfig(0, 0);
    this.ctx = null;
    this.canvasDom = null;
  }
  get data() {
    return this._data;
  }
  set data(v: excelConfig) {
    this._data = v;
    this._render();
  }

  get scale() {
    return this._scale;
  }
  set scale(v: number) {
    this._scale = v;
    this._render();
  }

  get scrollTop() {
    return this._scrollTop;
  }
  set scrollTop(v: number) {
    this._scrollTop = v;
    this._render();
  }

  get scrollLeft() {
    return this._scrollLeft;
  }
  set scrollLeft(v: number) {
    this._scrollLeft = v;
    this._render();
  }

  _getMaxWH() {
    let max = [0, 0];
    this.data.cells.forEach((rows, rIndex) => {
      max[1] += this.data.h[rIndex];
    })
    this.data.cells[0].cells.forEach((column, cIndex) => {
      max[0] += this.data.w[cIndex]
    })
    return max;
  }

  _preRenderFunc() {
    if (!this.canvasDom) {
      return;
    }
    let dpr = window.devicePixelRatio;
    this.canvasDom.height = this.canvasDom?.height;
    this.ctx?.scale(2 * this.scale, 2 * this.scale);
  }

  _render() {
    if (!this.canvasDom) {
      return;
    }
    this.contentWidth = 0;
    this.contentHeight = 0;
    this._preRenderFunc();

    // 渲染中间表格部分
    this._renderContent();
  }

  _renderContent() {
    const startX = this.paddingLeft - this.scrollLeft;
    const startY = this.paddingTop - this.scrollTop;
    let point = [startX, startY];

    this.data.cells.forEach((rows, rIndex) => {
      point[0] = startX;
      // 计算内容实际高度
      this.contentHeight += this.data.h[rIndex];
      const renderThisRow = point[1] + this.data.h[rIndex] > 0 && point[1] < this.height;

      if (renderThisRow || rIndex === 0) {
        rows.cells.forEach((column, cIndex) => {
          if (rIndex === 0) {
            // 计算内容实际宽度
            this.contentWidth += this.data.w[cIndex];
          }
          if (renderThisRow && point[0] + this.data.w[cIndex] > 0 && point[0] < this.width) {
            this._renderCell({
              point: point,
              cell: column,
              w: this.data.w[cIndex],
              h: this.data.h[rIndex]
            });
            this._renderTopBar({
              r: rIndex,
              c: cIndex,
              point: point,
              w: this.data.w[cIndex],
              h: this.data.h[rIndex]
            });
          }
          point[0] += this.data.w[cIndex];
        })
      }
      point[1] += this.data.h[rIndex];
    })
  }

  _renderTopBar({
    point,
    w,
    h,
    r,
    c
  }: {
    point: number[],
    w: number,
    h: number,
    r: number, // 行号
    c: number  // 列号
  }) {
    if (!this.ctx) {
      return;
    }
    let content = '';
    let x = point[0];
    let y = point[1];
    if (r === 0 && c === 0) {

    } else if (r === 0) {
      y = 0;
      h = this.paddingTop;
      content = c + '';
    } else if (c === 0) {
      x = 0;
      w = this.paddingLeft;
      content = r + '';
    }
    console.log(x, y, w, h)
    this.ctx.strokeStyle = '#b5b5b5'
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = '#DDDDDD'
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeRect(x, y, w, h);

    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "#000000"
    this.ctx.fillText(content, x, y + h - 4);
  }

  _renderCell({
    point,
    cell,
    w,
    h
  }: {
    point: number[],
    cell: cell,
    w: number,
    h: number
  }) {
    if (!this.ctx) {
      return;
    }
    this.ctx.strokeStyle = '#b5b5b5'
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.fillRect(point[0], point[1], w, h);
    this.ctx.strokeRect(point[0], point[1], w, h);

    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "#000000"
    this.ctx.fillText(cell.content, point[0], point[1] + h - 4);
  }

  _renderRect({
    point,
    content,
    w,
    h
  }: {
    point: number[],
    content: string,
    w: number,
    h: number
  }) {
    if (!this.ctx) {
      return;
    }
    this.ctx.strokeStyle = '#b5b5b5'
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = '#b5b5b5'
    this.ctx.fillRect(point[0], point[1], w, h);

    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "#000000"
    this.ctx.fillText(content, point[0], point[1] + h - 4);
  }
}