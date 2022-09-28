import { cell, CellTypeEnum, excelConfig } from '../../../interfaces';
import BaseEvent from '../../plugins/event';
import createBaseConfig from '../baseConfig';



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

    let startRIndex: null | number = null;
    let startCIndex: null | number = null;
    let renderBarArr: any[] = [];
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
            startRIndex = startRIndex === null ? rIndex : startRIndex;
            startCIndex = startCIndex === null ? cIndex : startCIndex;

            this._renderCell({
              point: point,
              cell: column,
              w: this.data.w[cIndex],
              h: this.data.h[rIndex]
            });
            if (startRIndex === rIndex || startCIndex === cIndex) {
              renderBarArr.unshift({
                r: rIndex,
                c: cIndex,
                point: point.slice(),
                w: this.data.w[cIndex],
                h: this.data.h[rIndex],
                startRIndex,
                startCIndex,
              })
            }
          }
          point[0] += this.data.w[cIndex];
        })
      }
      point[1] += this.data.h[rIndex];
    })

    renderBarArr.forEach(item => {
      this._renderTopBar(item);
    })
  }

  _renderTopBar({
    point,
    w,
    h,
    r,
    startRIndex,
    c,
    startCIndex,
  }: {
    point: number[],
    w: number,
    h: number,
    r: number, // 行号
    startRIndex: number,
    c: number,  // 列号
    startCIndex: number,
  }) {
    if (!this.ctx) {
      return;
    }
    let content = '';
    let x = point[0];
    let y = point[1];
    if (r === startRIndex && c === startCIndex) {
      // 渲染第一格上面的
      this._renderCell({
        point: [x, 0],
        cell: {
          style: {
            backgroundColor: '#DDDDDD',
            fontColor: '#000000'
          },
          content: c + 1 + '',
          type: CellTypeEnum.string
        },
        w,
        h: this.paddingTop
      })
      // 渲染第一格左边的
      this._renderCell({
        point: [0, y],
        cell: {
          style: {
            backgroundColor: '#DDDDDD',
            fontColor: '#000000'
          },
          content: r + 1 + '',
          type: CellTypeEnum.string
        },
        w: this.paddingLeft,
        h
      })
      // 渲染最左上角的
      this._renderCell({
        point: [0, 0],
        cell: {
          style: {
            backgroundColor: '#DDDDDD',
            fontColor: '#000000'
          },
          content: '',
          type: CellTypeEnum.string
        },
        w: this.paddingLeft,
        h: this.paddingTop
      })
      return;
    } else if (r === startRIndex) {
      y = 0;
      h = this.paddingTop;
      content = c + 1 + '';
    } else if (c === startCIndex) {
      x = 0;
      w = this.paddingLeft;
      content = r + 1 + '';
    }
    this._renderCell({
      point: [x, y],
      cell: {
        style: {
          backgroundColor: '#DDDDDD',
          fontColor: '#000000'
        },
        content,
        type: CellTypeEnum.string
      },
      w,
      h
    })
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
    this.ctx.fillStyle = cell.style.backgroundColor || '#FFFFFF'
    this.ctx.fillRect(point[0], point[1], w, h);
    this.ctx.strokeRect(point[0], point[1], w, h);

    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = cell.style.fontColor || '#000000'
    this.ctx.fillText(cell.content, point[0], point[1] + h - 4);
  }
}