// 这里的方法和值都是pretect ，为了方便插件开发，都先弄成public
import { cell, cellStyle, CellTypeEnum, excelConfig, renderCellProps, spanCell } from '../../interfaces';
import { RenderZIndex } from './constant';
import createBaseConfig from '../../utils/defaultData';
import DrawLayer from './drawLayer';
import { _throttleByRequestAnimationFrame } from '../../utils'
import { EventConstant } from '../../plugins/base/event';
import { PluginTypeEnum } from '../../plugins';


export default class Render extends DrawLayer {
  public _width: number; /** dom 实际width */
  public _height: number; /** dom 实际height */
  public paddingTop: number; // 上方的宽度 // 实际为上方的常驻条高度
  public paddingLeft: number; // 左侧的宽度 // 实际为左侧的常驻条宽度
  public contentWidth: number; // 实际内容的宽度
  public contentHeight: number; // 实际内容的宽度
  public _scale: number; // 缩放比例
  public maxScale: number; // 最大缩放比例
  public minScale: number; // 最小缩放比例

  public mouseX: number;// 鼠标x坐标
  public mouseY: number;// 鼠标y坐标

  public _data: excelConfig; // 当前excel的数据
  public _scrollTop: number; // 滚动的参数
  public _scrollLeft: number; // 滚动的参数

  public renderDataScope: [[number, number], [number, number]]
  public renderCellsArr: renderCellProps[][];
  public renderSpanCellsArr: renderCellProps[];

  public _render: () => void;

  public renderFuncArr: ((ctx: CanvasRenderingContext2D) => void)[][];

  constructor() {
    super();
    this._scrollTop = 0;
    this._scrollLeft = 0;
    this._width = 0;
    this._height = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.paddingTop = 20;
    this.paddingLeft = 40;
    this._scale = 1;
    this.maxScale = 4;
    this.minScale = 0.4;
    this.renderFuncArr = [];
    this.renderDataScope = [[0, 0], [0, 0]];
    this.renderSpanCellsArr = [];
    this.renderCellsArr = [];

    this._render = _throttleByRequestAnimationFrame(this._renderFunc.bind(this));

    this.on(EventConstant.RENDER, this._render);

    this._data = createBaseConfig(0, 0);
  }
  public get data() {
    return this._data;
  }
  public set data(v: excelConfig) {
    this._data = v;
    this._render();
  }
  // 经过缩放的宽度
  public get width() {
    return this._width / this.scale;
  }
  public set width(v: number) {
    this._width = v;
  }

  // 经过缩放的高度
  public get height() {
    return this._height / this.scale;
  }
  public set height(v: number) {
    this._height = v;
  }

  public get scale() {
    return this._scale;
  }
  public set scale(v: number) {
    this._scale = v;
    setTimeout(() => {
      this._render();
    }, 0);
  }

  public get scrollTop() {
    return this._scrollTop;
  }
  public set scrollTop(v: number) {
    this._scrollTop = v;
    this.emit(EventConstant.SCROLL_CONTENT, {
      scrollTop: this._scrollTop,
      scrollLeft: this._scrollLeft,
    })
    // 这是为了兼容触控板快速滚动并且急停的时候出现的未渲染的问题
    setTimeout(() => {
      this._render();
    }, 0);
  }

  public get scrollLeft() {
    return this._scrollLeft;
  }
  public set scrollLeft(v: number) {
    this._scrollLeft = v;
    this.emit(EventConstant.SCROLL_CONTENT, {
      scrollTop: this._scrollTop,
      scrollLeft: this._scrollLeft,
    })
    // 这是为了兼容触控板快速滚动并且急停的时候出现的未渲染的问题
    setTimeout(() => {
      this._render();
    }, 0);
  }

  public _preRenderFunc() {
    if (!this.canvasDom) {
      return;
    }
    let dpr = window.devicePixelRatio;
    this.canvasDom.height = this.canvasDom?.height;
    this.ctx?.scale(dpr * this.scale, dpr * this.scale);
  }

  public _renderFunc() {
    if (!this.canvasDom) {
      return;
    }
    this.contentWidth = 0;
    this.contentHeight = 0;
    this._preRenderFunc();

    // 渲染中间表格部分
    this._renderContent();
  }

  public _renderContent() {
    const startX = this.paddingLeft - this.scrollLeft;
    const startY = this.paddingTop - this.scrollTop;
    let point = [startX, startY]; // 锚点

    let startRIndex: null | number = null;
    let startCIndex: null | number = null;
    let renderBarArr: any[] = [];
    let renderLineArr: [[number, number], [number, number]][] = [];

    this.renderCellsArr = [];
    this.contentWidth = this.data.w.reduce((a, b) => a + b, 0);
    this.contentHeight = this.data.h.reduce((a, b) => a + b, 0);
    const drawMinLineX = Math.min(this.width, this.contentWidth + this.paddingLeft - this.scrollLeft);
    const drawMinLineY = Math.min(this.height, this.contentHeight + this.paddingTop - this.scrollTop);

    let hadDrawColumns = false;// 竖线只画一次的标志。
    let isFirstRender = true;// 用来统计绘制区域的标志

    renderLineArr.push([[0, this.paddingTop], [drawMinLineX, this.paddingTop]])
    renderLineArr.push([[this.paddingLeft, 0], [this.paddingLeft, drawMinLineY]])

    let row = -1;
    this.data.cells.forEach((rows, rIndex) => {
      point[0] = startX;
      const renderThisRow = point[1] + this.data.h[rIndex] > 0 && point[1] < this.height;
      if (renderThisRow) {
        row += 1;
        if (!this.renderCellsArr[row]) {
          this.renderCellsArr[row] = [];
        }
        rows.forEach((column, cIndex) => {
          if (renderThisRow && point[0] + this.data.w[cIndex] > 0 && point[0] < this.width) {
            startRIndex = startRIndex === null ? rIndex : startRIndex;
            startCIndex = startCIndex === null ? cIndex : startCIndex;
            if (!hadDrawColumns) {
              // 画竖线的
              const tempColumY = point[0] + this.data.w[cIndex];
              if (tempColumY > this.paddingLeft) {
                renderLineArr.push([[tempColumY, 0], [tempColumY, drawMinLineY]])
              }
            }


            if (isFirstRender) {
              isFirstRender = false;
              this.renderDataScope[0] = [rIndex, cIndex];
            }
            this.renderDataScope[1] = [rIndex, cIndex];

            this.renderCellsArr[row].push({
              location: {
                row: rIndex,
                column: cIndex,
              },
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
        hadDrawColumns = true;
      }
      point[1] += this.data.h[rIndex];
    })
    this.resetRenderFunction(RenderZIndex.TABLE_LINE, renderLineArr.map(item => () => {
      this.drawLine(...item);
    }))
    this.resetRenderFunction(RenderZIndex.TABLE_CELLS, this.renderCellsArr.flat().map(item => () => {
      this.drawCell(item);
    }))

    this.handleSpanCells();

    this.resetRenderFunction(RenderZIndex.SIDE_BAR, renderBarArr.map(item => () => {
      this.drawSideBar(item);
    }));

    // this.resetRenderFunction(RenderZIndex.SHADOW, [(ctx) => {
    //   ctx.save();
    //   ctx.shadowOffsetX = 0;
    //   ctx.shadowOffsetY = 0;
    //   ctx.shadowBlur = 20;
    //   ctx.shadowColor = "rgba(0, 0, 0, 1)";
    //   this.drawLine([this.paddingLeft, this.paddingTop], [this.width, this.paddingTop]);
    //   this.drawLine([this.paddingLeft, this.paddingTop], [this.paddingLeft, this.height]);
    //   ctx.restore();
    // }]);

    // 开始绘制
    this._renderFunctions();
  }

  /**
   * 处理跨行的单元格
   * 并且会只渲染在视图之内的单元格
   */
  public handleSpanCells() {
    this.renderSpanCellsArr = [];
    if (!this.data.spanCells) {
      return;
    }
    Object.keys(this.data.spanCells).forEach(key => {
      const startX = this.paddingLeft - this.scrollLeft;
      const startY = this.paddingTop - this.scrollTop;
      let point = [startX, startY]; // 锚点

      const cell = this.data.spanCells[key];
      const [y, x] = key.split('_').map(i => +i);
      point[0] += this.data.w.slice(0, x).reduce((a, b) => a + b, 0);
      point[1] += this.data.h.slice(0, y).reduce((a, b) => a + b, 0);
      const _w = this.data.w.slice(x, x + cell.span[0]).reduce((a, b) => a + b, 0);
      const _h = this.data.h.slice(y, y + cell.span[1]).reduce((a, b) => a + b, 0);

      if (point[0] > this.width || (point[0] + _w) < 0 || point[1] > this.height || (point[1] + _h) < 0) {
        return;
      }
      if (!cell.style.backgroundColor) {
        cell.style.backgroundColor = this.color('white');
      }
      if (cell.style.backgroundColor !== this.color('white')) {
        cell.style.backgroundColor = this.color('white');
      }
      this.renderSpanCellsArr.push({
        location: {
          row: y,
          column: x,
        },
        point,
        cell: cell,
        w: _w,
        h: _h
      });
    })
    this.resetRenderFunction(RenderZIndex.TABLE_SPAN_CELLS, this.renderSpanCellsArr.map(item => () => {
      this.drawCell(item, true);
    }))
  }

  public resetRenderFunction(index: RenderZIndex, funcs: ((ctx: CanvasRenderingContext2D) => void)[]) {
    this.renderFuncArr[index] = funcs;
  }
  public addRenderFunction(index: RenderZIndex, funcs: ((ctx: CanvasRenderingContext2D) => void)[]) {
    if (!this.renderFuncArr[index]) {
      this.renderFuncArr[index] = [];
    }
    this.renderFuncArr[index] = this.renderFuncArr[index].concat(funcs);
  }

  public _renderFunctions() {
    if (!this.ctx) {
      return;
    }
    this.renderFuncArr.forEach(funcs => {
      funcs.forEach(func => {
        func(this.ctx as CanvasRenderingContext2D);
      })
    })
  }

  public drawSideBar({
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
      backgroundColor: this.color('sideBar'),
      fontColor: this.color('black'),
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
      }, true)
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
      }, true)
      // 渲染最左上角的
      this.drawLeftTopCell({
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
    }, true)
  }
}