// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from "..";
import Base, { BaseDataType, selectedCellType } from "../../base/base";
import { EventZIndex, RenderZIndex } from "../../base/constant";
import { rectType } from "../../base/drawLayer";
import { cell } from "../../../interfaces";
import { combineCell, debounce, deepClone, judgeCross, judgeOver } from "../../../utils";
import { createDefaultCell } from "../../../utils/defaultData";
import { EventConstant } from "../base/event";
import ExcelBaseFunction from "../EventStack";
import KeyBoardPlugin from "../KeyBoardPlugin";
import { BASE_KEYS_ENUM, CONTENT_KEYS, OPERATE_KEYS_ENUM } from "../KeyBoardPlugin/constant";
import SelectPowerPlugin from "./SelectPowerPlugin";

export interface CellScopeType {
  startCell: selectedCellType;
  endCell: selectedCellType;
}

export interface CellCornerScopeType {
  leftTopCell: selectedCellType;
  rightBottomCell: selectedCellType;
}

export default class EditCellPlugin {
  public name: string;
  private _this: Base;
  private KeyboardPlugin: KeyBoardPlugin;
  private SelectPlugin: SelectPowerPlugin;
  private ExcelBaseFunction: ExcelBaseFunction;
  private editDom: null | HTMLTextAreaElement;
  private editCell: null | selectedCellType;


  private pointDownCell: null | selectedCellType;  // 剪切单元格专用的，记录鼠标点下去的时候的cell位置。
  private startCopyCell: null | CellScopeType;  // 这个是用户拖拽单元格边框的标志， 用处是剪切单元格。

  private startRegularCell: null | CellScopeType;  // 这个是用户拖拽单元格右下角开始的标志， 用处就是有规则的扩展单元格
  private currentCell: null | selectedCellType; // 拖拽的时候鼠标的落点，用于计算的
  constructor(_this: Base) {
    this.name = PluginTypeEnum.CommonInputPowerPlugin;
    this._this = _this;

    this.initPlugin();
    this.registerKeyboardEvent();

    this.initEvent();
    this.addRenderFunc();
    this.transformEditDom();
  }

  private initPlugin() {
    if (this._this[PluginTypeEnum.SelectPowerPlugin]) {
      this.SelectPlugin = this._this[PluginTypeEnum.SelectPowerPlugin]
    } else {
      console.error('CommonInputPlugin 依赖于 SelectPowerPlugin, 请正确注册插件!');
    }
    if (this._this[PluginTypeEnum.ExcelBaseFunction]) {
      this.ExcelBaseFunction = this._this[PluginTypeEnum.ExcelBaseFunction]
    } else {
      console.error('CommonInputPlugin 依赖于 ExcelBaseFunction, 请正确注册插件!');
    }
  }

  private registerKeyboardEvent() {
    if (this._this[PluginTypeEnum.KeyBoardPlugin]) {
      this.KeyboardPlugin = this._this[PluginTypeEnum.KeyBoardPlugin]

      this.KeyboardPlugin.register({
        mainKeys: OPERATE_KEYS_ENUM.Escape,
        callback: [(e) => {
          e.preventDefault();
          this.removeDom()
        }]
      })


      // tab处理
      const tabCB = (isLeft: boolean) => {
        this.removeDom();
        if (this.SelectPlugin.selectCell) {
          const mirror = deepClone(this.SelectPlugin.selectCell);
          mirror.column += (isLeft ? 1 : -1);
          mirror.column = Math.max(mirror.column, 0);
          mirror.column = Math.min(mirror.column, this._this._data.w.length - 1);

          this.SelectPlugin._startCell = deepClone(mirror);
          this.SelectPlugin._endCell = deepClone(mirror);
          this.SelectPlugin.selectCell = mirror;
          this._this._render()
        }
      }
      this.KeyboardPlugin.register({
        baseKeys: [],
        mainKeys: OPERATE_KEYS_ENUM.Tab,
        callback: [(e) => {
          e.preventDefault();
          tabCB(true);
        }]
      })
      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Shift],
        mainKeys: OPERATE_KEYS_ENUM.Tab,
        callback: [(e) => {
          e.preventDefault();
          tabCB(false);
        }]
      })

      // 回车处理
      const enterCB = (isUp: boolean) => {
        this.removeDom();
        if (this.SelectPlugin.selectCell) {
          const mirror = deepClone(this.SelectPlugin.selectCell);
          mirror.row += (isUp ? 1 : -1);
          mirror.row = Math.max(mirror.row, 0);
          mirror.row = Math.min(mirror.row, this._this._data.h.length - 1);

          this.SelectPlugin._startCell = deepClone(mirror);
          this.SelectPlugin._endCell = deepClone(mirror);
          this.SelectPlugin.selectCell = mirror;
          this._this._render()
        }
      }
      this.KeyboardPlugin.register({
        baseKeys: [],
        mainKeys: OPERATE_KEYS_ENUM.Enter,
        callback: [(e) => {
          e.preventDefault();
          enterCB(true);
        }]
      })

      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Shift],
        mainKeys: OPERATE_KEYS_ENUM.Enter,
        callback: [(e) => {
          e.preventDefault();
          enterCB(false);
        }]
      })


      this.KeyboardPlugin.register({
        mainKeys: Object.keys(CONTENT_KEYS),
        callback: [(e, v) => {
          if (!this.SelectPlugin.selectCell) {
            return;
          }
          const dom = this.initEditBoxDom(this.SelectPlugin.selectCell);
          if (dom) {
            // 比较hack， 在这个dom上绑定了oninput的方法，借助这个方法可以执行到定义的时候的上下文，
            dom.oninput(v.mainKeys)
          }
        }]
      })
    }
  }

  private addRenderFunc() {
    this._this.addRenderFunction(RenderZIndex.SELECT_CELLS, [(ctx) => {
      if (!this.currentCell) {
        return;
      }
      if (this.startRegularCell) {
        const { startCell, endCell } = this.startRegularCell;
        const { currentCell } = this;
        const { leftTopCell, rightBottomCell } = combineCell([startCell, endCell, currentCell]);

        this.drawDashBorder(ctx, this.calBorder(leftTopCell, rightBottomCell))

        return;
      }

      if (this.startCopyCell && this.pointDownCell) {
        const { leftTopCell, rightBottomCell } = this.getCurrentScopeInCopy();

        this.drawDashBorder(ctx, this.calBorder(leftTopCell, rightBottomCell))
      }
    }])
  }

  private calBorder(startCell: selectedCellType, endCell: selectedCellType) {
    const { _data, paddingLeft, paddingTop, scrollLeft, scrollTop } = this._this;

    startCell.column = Math.max(0, startCell.column);
    startCell.row = Math.max(0, startCell.row);
    endCell.column = Math.max(0, endCell.column);
    endCell.row = Math.max(0, endCell.row);

    const cellPosition: rectType = [
      _data.w.slice(0, startCell.column).reduce((a, b) => a + b, 0) + paddingLeft - scrollLeft,
      _data.h.slice(0, startCell.row).reduce((a, b) => a + b, 0) + paddingTop - scrollTop,
      _data.w.slice(startCell.column, endCell.column + 1).reduce((a, b) => a + b, 0),
      _data.h.slice(startCell.row, endCell.row + 1).reduce((a, b) => a + b, 0),
    ]

    return cellPosition;
  }

  private drawDashBorder(ctx: CanvasRenderingContext2D, rect: rectType) {
    ctx.save();
    ctx.strokeStyle = '#4a89fe'
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.setLineDash([5]);
    ctx.strokeRect(...rect);
    ctx.restore();
  }

  private transformEditDom() {
    this._this.addRenderFunction(RenderZIndex.SCROLL_BAR, [() => {
      if (this.editCell && this.editDom && this._this.canvasDom) {
        const position = this._this.getRectByCell(this.editCell);

        position[0] += this._this.canvasDom.offsetLeft;
        position[1] += this._this.canvasDom.offsetTop;

        this.resetEditDomPosition(...position);
      }
    }])
  }


  // 通用的判断鼠标是在边框还是右下角rect的方法
  private commonJudgeFunc(e: MouseEvent) {
    const point = this._this.transformXYInContainer(e);
    if (!point || !this.SelectPlugin._borderPosition) {
      return false;
    }
    const { anchor, w, h } = this.SelectPlugin._borderPosition;
    const strokeRectWidth = 8;
    // 判断是不是单元格内部
    if (judgeOver(point, [anchor[0] + strokeRectWidth / 2, anchor[1] + strokeRectWidth / 2, w - strokeRectWidth, + h - strokeRectWidth])) {
      return false;
    }
    // 判断是不是单元格外部
    if (!judgeOver(point, [anchor[0] - strokeRectWidth / 2, anchor[1] - strokeRectWidth / 2, w + strokeRectWidth, + h + strokeRectWidth])) {
      return false;
    }
    // 判断是不是右下角的小框
    if (judgeOver(point, [anchor[0] + w - strokeRectWidth / 2, anchor[1] + h - strokeRectWidth / 2, strokeRectWidth, strokeRectWidth])) {
      return ['grab', point];
    }

    // 剩下的肯定是边框了
    return ['cell', point]
  }

  private initEvent() {
    // 这个比较hack， 借助scrollbar最高的优先级，并且在judge方法中来判断鼠标有没有点到输入框的外部。 为了不管怎么样，都能运行到。
    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SCROLL_BAR,
      judgeFunc: (e) => {
        if (this.editDom && !(e as any).path.includes(this.editDom)) {
          this.removeDom();
        }
        return false;
      },
      innerFunc: () => { },
    })

    this.handleMouseDown();
    this.handleDBClick();
    this.handleMouseMove();
    this.handleMouseUp();
  }

  private initEditBoxDom(cell: selectedCellType) {
    if (this._this.canvasDom) {
      this.editCell = cell;

      const position = this._this.getRectByCell(this.editCell);

      position[0] += this._this.canvasDom.offsetLeft;
      position[1] += this._this.canvasDom.offsetTop;

      return this.createEditBox(this.editCell, position);
    }
    return null
  }

  private handleDBClick() {
    const dbClickCB = (e, cell: selectedCellType) => {
      this.initEditBoxDom(cell);
    }
    this._this.setEvent(EventConstant.DB_CLICK, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        if (this.commonJudgeFunc(e)) {
          return false;
        }

        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }

        if (this.SelectPlugin._startCell && this.SelectPlugin._endCell && this.SelectPlugin._startCell.row !== this.SelectPlugin._endCell.row && this.SelectPlugin._startCell.column !== this.SelectPlugin._endCell.column) {
          return false;
        }

        const cell = this._this.getCellByPoint([point[0], point[1]]);
        if (cell && cell.column !== -1 && cell.row !== -1) {
          return cell;
        }
        return false;
      },
      innerFunc: dbClickCB.bind(this),
    })
  }

  private handleMouseDown() {
    // 处理鼠标点击事件
    const handleMouseDownCursor = (e: MouseEvent, [type, point]) => {
      const cells = this.SelectPlugin.cornerCells;
      const cell = this._this.getCellByPoint(point);
      if (!cells || !cell) {
        return;
      }
      const { startCell: leftTopCell, endCell: rightBottomCell } = cells;


      // 下面是为了收敛选中的cell的，保证是框选内部的cell
      if (cell.column < leftTopCell.column) {
        cell.column = leftTopCell.column;
      }
      if (cell.column > rightBottomCell.column) {
        cell.column = rightBottomCell.column;
      }

      if (cell.row < leftTopCell.row) {
        cell.row = leftTopCell.row;
      }
      if (cell.row > rightBottomCell.row) {
        cell.row = rightBottomCell.row;
      }

      this.pointDownCell = cell;

      // cell 代表边框， 说明是剪切操作
      if (type === 'cell') {
        this.removeDom();
        this.startCopyCell = {
          startCell: leftTopCell,
          endCell: rightBottomCell,
        }
      } else if (type === 'grab') {
        this.removeDom();
        this.startRegularCell = {
          startCell: leftTopCell,
          endCell: rightBottomCell,
        }
      }
    }

    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return this.commonJudgeFunc(e);
      },
      innerFunc: handleMouseDownCursor.bind(this),
      outerFunc: () => {
        document.body.style.cursor = 'default';
      }
    })
  }
  private handleMouseMove() {
    // 处理鼠标悬浮改变样式的。  边框和右下角
    const handleOverCursor = (e: MouseEvent, [type, point]) => {
      if (type === 'grab') {
        document.body.style.cursor = 'cell';
      } else if (type === 'cell') {
        document.body.style.cursor = 'grab';
      }
    }

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return this.commonJudgeFunc(e);
      },
      innerFunc: handleOverCursor.bind(this),
      outerFunc: () => {
        document.body.style.cursor = 'default';
      }
    })



    const handleMouseMoveCB = (e: MouseEvent) => {
      const point = this._this.transformXYInContainer(e, true);
      if (!point) {
        return;
      }

      const cell = this._this.getCellByPoint(point);

      if (!cell) {
        return;
      }

      this.currentCell = cell;
      this._this._render();
    }
    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        if (this.startCopyCell || this.startRegularCell) {
          return true;
        }
        return false;
      },
      innerFunc: handleMouseMoveCB.bind(this),
    })
  }
  private handleMouseUp() {
    // 处理鼠标点击事件
    const handleMouseUp = () => {
      if (this.startCopyCell) {
        this.handleCopyCB();
      }
      if (this.startRegularCell) {
        this.handleRegularCB();
      }
      this.startCopyCell = null;
      this.pointDownCell = null;
      this.startRegularCell = null;
      this.currentCell = null;
      this._this._render();
    }

    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        if (!(this.startCopyCell || this.startRegularCell)) {
          return false;
        }
        return true;
      },
      innerFunc: handleMouseUp.bind(this),
    })
  }

  private resetEditDomPosition(x: number, y: number, w: number, h: number) {
    if (!this.editDom || !this._this.canvasDom) {
      return;
    }
    const { paddingLeft, paddingTop, width, height } = this._this;
    const { _scrollBarWidth = 10 } = this._this[PluginTypeEnum.ScrollPlugin]
    const contentX = paddingLeft + (this._this.canvasDom?.offsetLeft || 0);
    const contentY = paddingTop + (this._this.canvasDom?.offsetTop || 0);

    const display = judgeCross([x, y, w, h], [contentX, contentY, width - paddingLeft - _scrollBarWidth, height - paddingTop - _scrollBarWidth]);

    x += 1;
    y += 1;
    x = Math.max(contentX, x)
    y = Math.max(contentY, y)

    x = Math.min(this._this.canvasDom.offsetLeft + width - _scrollBarWidth - w + 3, x)
    y = Math.min(this._this.canvasDom.offsetTop + height - _scrollBarWidth - h + 2, y)


    this.editDom.style.width = (w - 2) * this._this.scale + 'px';
    this.editDom.style.height = (h - 2) * this._this.scale + 'px';

    this.editDom.style.display = display ? 'block' : 'none'

    this.editDom.style.transform = `translate(${x}px, ${y}px)`;
  }

  private createEditBox(cell: selectedCellType, [x, y, w, h]: rectType) {
    if (this.editDom) {
      return;
    }
    const originData = this._this.getRealCell(cell);

    this.editDom = document.createElement('textarea');
    this.setCommonStyle(this.editDom, originData);
    this.stopPropagation(this.editDom);

    // 需要微调是为了不遮挡
    this.resetEditDomPosition(x, y, w, h)

    this.handleDomValue(this.editDom, originData, cell);
    (this._this.canvasDom as HTMLElement).parentElement?.appendChild(this.editDom);
    setTimeout(() => {
      this.editDom?.focus();
    }, 0);
    return this.editDom;
  }

  private handleDomValue(dom: HTMLTextAreaElement, originData: cell, cell: selectedCellType) {
    dom.value = originData.content;
    let preValue = dom.value;
    const setEventStack = debounce((newV: string) => {
      const preCellData = this._this.getDataByScope({
        leftTopCell: cell,
        rightBottomCell: cell
      })
      const afterCellData: BaseDataType = deepClone(preCellData);

      const spanCellKeys = Object.keys(preCellData.data.spanCells);
      if (spanCellKeys.length > 0) {
        preCellData.data.spanCells[spanCellKeys[0]].content = preValue;
        afterCellData.data.spanCells[spanCellKeys[0]].content = newV;
      } else {
        preCellData.data.cells[0][0].content = preValue;
        afterCellData.data.cells[0][0].content = newV;
      }

      this.ExcelBaseFunction.cellsChange({
        scope: {
          leftTopCell: cell,
          rightBottomCell: cell
        },
        pre_data: preCellData.data,
        after_data: afterCellData.data,
        time_stamp: new Date()
      }, false)

      preValue = newV;
    }, 300)

    dom.oninput = (newV) => {
      if (typeof newV === 'string') {
        dom.value = newV;
        originData.content = newV;
        setEventStack(dom.value)
      } else {
        originData.content = dom.value;
        setEventStack(dom.value)
      }
    }
  }

  private _stopPropagation(e: Event) {
    e.stopPropagation();
  }

  private _stopPropagation_arrow(e: KeyboardEvent) {
    const stopKeys: string[] = [...[
      OPERATE_KEYS_ENUM.ArrowDown,
      OPERATE_KEYS_ENUM.ArrowLeft,
      OPERATE_KEYS_ENUM.ArrowRight,
      OPERATE_KEYS_ENUM.ArrowUp
    ], ...Object.keys(CONTENT_KEYS)]

    if (stopKeys.includes(e.key as any)) {
      e.stopPropagation();
    }
  }

  private stopPropagation(dom: HTMLTextAreaElement) {
    dom.addEventListener('mousedown', this._stopPropagation);
    dom.addEventListener('mouseup', this._stopPropagation);
    dom.addEventListener('keydown', this._stopPropagation_arrow);
    dom.addEventListener('keyup', this._stopPropagation_arrow);
  }

  private removeDom() {
    if (this.editDom) {
      this.editDom.remove();
      this.editDom.removeEventListener('mousedown', this._stopPropagation);
      this.editDom.removeEventListener('mouseup', this._stopPropagation);
      this.editDom.removeEventListener('keydown', this._stopPropagation_arrow);
      this.editDom.removeEventListener('keyup', this._stopPropagation_arrow);
      this.editDom = null;
      this._this._render();
    }
  }

  private setCommonStyle(dom: HTMLElement, originData: cell) {
    const cellStyle = originData.style;

    dom.style.backgroundColor = cellStyle.backgroundColor ? cellStyle.backgroundColor : this._this.color('white');
    Object.keys(cellStyle).forEach(key => {
      dom.style[key] = cellStyle[key];
    })
    dom.style.font = cellStyle.font || '';
    dom.style.fontSize = (cellStyle.fontSize || 12) * this._this.scale + 'px';
    dom.style.textAlign = cellStyle.align || '';
    dom.style.color = cellStyle.fontColor || this._this.color('black');
    dom.style.position = 'absolute';
    dom.style.top = '0px';
    dom.style.left = '0px';
    dom.style.outline = 'none';
    dom.style.border = '1px solid #4a89fe';
    dom.style.resize = 'none';
  }

  private getCurrentScopeInCopy() {
    const { startCell: leftTopCell, endCell: rightBottomCell } = deepClone(this.startCopyCell);
    if (this.currentCell && this.pointDownCell) {
      let columnGap = this.currentCell.column - this.pointDownCell.column;
      let rowGap = this.currentCell.row - this.pointDownCell.row;

      columnGap = Math.max(columnGap, -leftTopCell.column);
      rowGap = Math.max(rowGap, -leftTopCell.row);

      columnGap = Math.min(columnGap, this._this._data.w.length - rightBottomCell.column);
      rowGap = Math.min(rowGap, this._this._data.h.length - 1 - rightBottomCell.row);

      leftTopCell.column += columnGap;
      leftTopCell.row += rowGap;
      rightBottomCell.column += columnGap;
      rightBottomCell.row += rowGap;
      return { leftTopCell, rightBottomCell } as CellCornerScopeType
    }
    return { leftTopCell, rightBottomCell } as CellCornerScopeType
  }
  private handleCopyCB() {
    if (!this.startCopyCell) {
      return;
    }
    const sourceCells: CellScopeType = deepClone(this.startCopyCell);
    const targetCells = this.getCurrentScopeInCopy();

    const SourceData = this._this.getDataByScope({
      leftTopCell: sourceCells.startCell,
      rightBottomCell: sourceCells.endCell
    });

    // 生成sourceData处的空数据
    const SourceAfterCells: cell[][] = [];
    for (let row = sourceCells.startCell.row; row <= sourceCells.endCell.row; row++) {
      const temp: cell[] = [];
      for (let column = sourceCells.startCell.column; column <= sourceCells.endCell.column; column++) {
        temp.push(createDefaultCell());
      }
      SourceAfterCells.push(temp);
    }


    // 如果有新的 生成spanCell。
    const tempMap = {};
    const SourcePreSpanCells = deepClone(SourceData.data.spanCells);
    Object.keys(SourceData.data.spanCells).forEach(key => {
      // delete this._this._data.spanCells[key];
      const newKey = key.split('_').map(Number);
      newKey[0] += targetCells.leftTopCell.row - SourceData.scope.leftTopCell.row;
      newKey[1] += targetCells.leftTopCell.column - SourceData.scope.leftTopCell.column;
      tempMap[newKey.join('_')] = SourceData.data.spanCells[key];
    })
    SourceData.data.spanCells = tempMap;

    const targetCellsPreData = this._this.getDataByScope(targetCells);

    this.ExcelBaseFunction.cellsMove({
      sourceData: {
        scope: {
          leftTopCell: sourceCells.startCell,
          rightBottomCell: sourceCells.endCell
        },
        pre_data: {
          ...SourceData.data,
          spanCells: SourcePreSpanCells
        },
        after_data: {
          cells: SourceAfterCells,
          w: SourceData.data.w,
          h: SourceData.data.h,
          spanCells: {},
        },
      },
      targetData: {
        scope: targetCells,
        pre_data: targetCellsPreData.data,
        after_data: SourceData.data,
      },
      time_stamp: new Date()
    })

    this.SelectPlugin.selectCells(targetCells)
  }
  private handleRegularCB() {

  }
}