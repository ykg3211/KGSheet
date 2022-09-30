import { cell, cellStyle, CellTypeEnum, excelConfig, renderCellProps } from '../../interfaces';
import { renderZIndex } from './constant';
import createBaseConfig from '../../utils/defaultData';
import DrawLayer from './drawLayer';
import _throttleByRequestAnimationFrame from '../../utils/throttle'


export default class Render extends DrawLayer {
  protected width: number; /** dom width */
  protected height: number; /** dom height */
  protected paddingTop: number;
  protected paddingLeft: number;
  protected contentWidth: number;
  protected contentHeight: number;
  protected _scale: number;
  protected maxScale: number;

  protected mouseX: number;// 鼠标x坐标
  protected mouseY: number;// 鼠标y坐标

  protected _data: excelConfig;
  protected _scrollTop: number;
  protected _scrollLeft: number;

  protected _render: () => void;

  protected renderFuncArr: ((ctx: CanvasRenderingContext2D) => void)[][];

  constructor() {
    super();
    this._scrollTop = 0;
    this._scrollLeft = 0;
    this.width = 0;
    this.height = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.paddingTop = 20;
    this.paddingLeft = 40;
    this._scale = 1;
    this.maxScale = 4;
    this.renderFuncArr = [];

    this._render = _throttleByRequestAnimationFrame(this._renderFunc.bind(this));
    this._data = createBaseConfig(0, 0);
  }
  protected get data() {
    return this._data;
  }
  protected set data(v: excelConfig) {
    this._data = v;
    this._render();
  }

  protected get scale() {
    return this._scale;
  }
  protected set scale(v: number) {
    this._scale = v;
    this._render();
  }

  protected get scrollTop() {
    return this._scrollTop;
  }
  protected set scrollTop(v: number) {
    this._scrollTop = v;
    this._render();
  }

  protected get scrollLeft() {
    return this._scrollLeft;
  }
  protected set scrollLeft(v: number) {
    this._scrollLeft = v;
    this._render();
  }

  protected _preRenderFunc() {
    if (!this.canvasDom) {
      return;
    }
    let dpr = window.devicePixelRatio;
    this.canvasDom.height = this.canvasDom?.height;
    this.ctx?.scale(dpr * this.scale, dpr * this.scale);
  }

  protected _renderFunc() {
    if (!this.canvasDom) {
      return;
    }
    this.contentWidth = 0;
    this.contentHeight = 0;
    this._preRenderFunc();

    // 渲染中间表格部分
    this._renderContent();
  }

  protected _renderContent() {
    const startX = this.paddingLeft - this.scrollLeft;
    const startY = this.paddingTop - this.scrollTop;
    let point = [startX, startY]; // 锚点

    let startRIndex: null | number = null;
    let startCIndex: null | number = null;
    let renderBarArr: any[] = [];
    let renderCellsArr: renderCellProps[] = [];
    let renderLineArr: [[number, number], [number, number]][] = [];
    this.contentWidth = this.data.w.reduce((a, b) => a + b, 0);
    this.contentHeight = this.data.h.reduce((a, b) => a + b, 0);
    // const drawMinLineX = Math.min(this.contentWidth + this.paddingLeft, this.width)
    const drawMinLineX = Math.min(this.width, this.contentWidth + this.paddingLeft - this.scrollLeft);
    const drawMinLineY = Math.min(this.height, this.contentHeight + this.paddingTop - this.scrollTop);

    let hadDrawColums = false;

    renderLineArr.push([[0, this.paddingTop], [drawMinLineX, this.paddingTop]])
    renderLineArr.push([[this.paddingLeft, 0], [this.paddingLeft, drawMinLineY]])


    this.data.cells.forEach((rows, rIndex) => {
      point[0] = startX;

      // 这一行是否渲染， 因为要统计内容宽度  所以得有一个全量遍历。


      const renderThisRow = point[1] + this.data.h[rIndex] > 0 && point[1] < this.height;
      if (renderThisRow) {
        rows.cells.forEach((column, cIndex) => {
          if (renderThisRow && point[0] + this.data.w[cIndex] > 0 && point[0] < this.width) {
            startRIndex = startRIndex === null ? rIndex : startRIndex;
            startCIndex = startCIndex === null ? cIndex : startCIndex;
            if (!hadDrawColums) {
              // 画竖线的
              const tempColumY = point[0] + this.data.w[cIndex];
              if (tempColumY > this.paddingLeft) {
                renderLineArr.push([[tempColumY, 0], [tempColumY, drawMinLineY]])
              }
            }

            renderCellsArr.push({
              point: point.slice(),
              cell: column,
              w: this.data.w[cIndex],
              h: this.data.h[rIndex]
            })

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

        const tempRowX = point[1] + this.data.h[rIndex];
        // 画横线的
        if (tempRowX > this.paddingTop) {
          renderLineArr.push([[0, tempRowX], [drawMinLineX, tempRowX]])
        }
        hadDrawColums = true;
      }
      point[1] += this.data.h[rIndex];
    })

    this.renderFuncArr[renderZIndex.TABLE_LINE] = renderLineArr.map(item => () => {
      this.drawLine(...item);
    });

    this.renderFuncArr[renderZIndex.TABLE_CELLS] = renderCellsArr.map(item => () => {
      this.drawCell(item);
    });

    this.renderFuncArr[renderZIndex.LEFT_TOP_BAR] = renderBarArr.map(item => () => {
      this._renderTopBar(item);
    });

    this._renderFunctions();
  }

  protected addRenderFunction(index: renderZIndex, funcs: ((ctx: CanvasRenderingContext2D) => void)[]) {
    if (!this.renderFuncArr[index]) {
      this.renderFuncArr[index] = [];
    }
    this.renderFuncArr[index] = this.renderFuncArr[index].concat(funcs);
  }

  protected _renderFunctions() {
    if (!this.ctx) {
      return;
    }
    this.renderFuncArr.forEach(funcs => {
      funcs.forEach(func => {
        func(this.ctx as CanvasRenderingContext2D);
      })
    })
  }

  protected _renderTopBar({
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
    const baseStyle: cellStyle = {
      backgroundColor: '#DDDDDD',
      fontColor: '#000000',
      align: 'center'
    }
    if (r === startRIndex && c === startCIndex) {
      // 渲染第一格上面的
      this.drawCell({
        point: [x, 0],
        cell: {
          style: baseStyle,
          content: c + 1 + '',
          type: CellTypeEnum.string
        },
        w,
        h: this.paddingTop
      })
      // 渲染第一格左边的
      this.drawCell({
        point: [0, y],
        cell: {
          style: baseStyle,
          content: r + 1 + '',
          type: CellTypeEnum.string
        },
        w: this.paddingLeft,
        h
      })
      // 渲染最左上角的
      this.drawCell({
        point: [0, 0],
        cell: {
          style: baseStyle,
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
    this.drawCell({
      point: [x, y],
      cell: {
        style: baseStyle,
        content,
        type: CellTypeEnum.string
      },
      w,
      h
    })
  }
}