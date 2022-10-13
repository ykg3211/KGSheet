// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from "..";
import Base, { selectedCellType } from "../../core/base/base";
import { EventZIndex, RenderZIndex } from "../../core/base/constant";
import { rectType } from "../../core/base/drawLayer";
import { cell } from "../../interfaces";
import { combineCell, judgeCross, judgeOver } from "../../utils";
import { createDefaultCell } from "../../utils/defaultData";
import { EventConstant } from "../event";
import SelectPowerPlugin, { borderType } from "./SelectPowerPlugin";

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
  private selectPlugin: SelectPowerPlugin;
  private editDom: null | HTMLTextAreaElement;
  private editCell: null | selectedCellType;


  private pointDownCell: null | selectedCellType;  // 剪切单元格专用的，记录鼠标点下去的时候的cell位置。
  private startCopyCell: null | CellScopeType;  // 这个是用户拖拽单元格边框的标志， 用处是剪切单元格。

  private startRegularCell: null | CellScopeType;  // 这个是用户拖拽单元格右下角开始的标志， 用处就是有规则的扩展单元格
  private currentCell: null | selectedCellType;
  constructor(_this: Base) {
    this.name = PluginTypeEnum.CommonInputPowerPlugin;
    this._this = _this;

    if (this._this[PluginTypeEnum.SelectPowerPlugin]) {
      this.selectPlugin = this._this[PluginTypeEnum.SelectPowerPlugin]
    } else {
      console.error('CommonInputPlugin 依赖于 SelectPowerPlugin, 请正确注册插件!');
    }

    this.initEvent();
    this.addRenderFunc();
    this.transformEditDom();
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
    if (!point || !this.selectPlugin._borderPosition) {
      return false;
    }
    const { anchor, w, h } = this.selectPlugin._borderPosition;
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

  private handleDBClick() {
    const dbClickCB = (e, cell: {
      row: number,
      column: number
    }) => {
      if (this._this.canvasDom) {
        this.editCell = cell;

        const position = this._this.getRectByCell(this.editCell);

        position[0] += this._this.canvasDom.offsetLeft;
        position[1] += this._this.canvasDom.offsetTop;

        this.createEditBox(this.editCell, position);
      }
    }
    this._this.setEvent(EventConstant.DB_CLICK, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        if (this.commonJudgeFunc(e)) {
          return false;
        }

        const point = this._this.transformXYInContainer(e, true);
        if (!point) {
          return false;
        }

        if (this.selectPlugin._startCell && this.selectPlugin._endCell && this.selectPlugin._startCell.row !== this.selectPlugin._endCell.row && this.selectPlugin._startCell.column !== this.selectPlugin._endCell.column) {
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
      const cells = this.selectPlugin.cornerCells;
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
        this.startCopyCell = {
          startCell: leftTopCell,
          endCell: rightBottomCell,
        }
      } else if (type === 'grab') {
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
      setTimeout(() => {
        this._this._render();
      }, 0);
    }

    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        if (!(this.startCopyCell || this.startRegularCell)) {
          return false;
        }
        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }
        const { paddingLeft, paddingTop, width, height } = this._this;
        const { _scrollBarWidth = 10 } = this._this[PluginTypeEnum.ScrollPlugin]
        if (judgeOver(point, [paddingLeft, paddingTop, width - paddingLeft - _scrollBarWidth, height - paddingTop - _scrollBarWidth])) {
          return point;
        }
        return false
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

    this.handleDomValue(this.editDom, originData);
    (this._this.canvasDom as HTMLElement).parentElement?.appendChild(this.editDom);
    setTimeout(() => {
      this.editDom?.focus();
    }, 0);
  }

  private handleDomValue(dom: HTMLTextAreaElement, originData: cell) {
    dom.value = originData.content;
    dom.oninput = () => {
      originData.content = dom.value;
    }
  }

  private _stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  private stopPropagation(dom: HTMLTextAreaElement) {
    dom.addEventListener('mousedown', this._stopPropagation);
  }

  private removeDom() {
    if (this.editDom) {
      this.editDom.remove();
      this.editDom.removeEventListener('mousedown', this._stopPropagation);
      this.editDom = null;
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
    // dom.style.border = 'none';
    dom.style.resize = 'none';
  }

  private getCurrentScopeInCopy() {
    const { startCell: leftTopCell, endCell: rightBottomCell } = JSON.parse(JSON.stringify(this.startCopyCell));
    if (this.currentCell && this.pointDownCell) {
      leftTopCell.column += this.currentCell.column - this.pointDownCell.column;
      leftTopCell.row += this.currentCell.row - this.pointDownCell.row;
      rightBottomCell.column += this.currentCell.column - this.pointDownCell.column;
      rightBottomCell.row += this.currentCell.row - this.pointDownCell.row;
      return { leftTopCell, rightBottomCell } as CellCornerScopeType
    }
    return { leftTopCell, rightBottomCell } as CellCornerScopeType
  }
  private handleCopyCB() {
    if (!this.startCopyCell) {
      return;
    }
    const sourceCells: CellScopeType = JSON.parse(JSON.stringify(this.startCopyCell));
    const targetCells = this.getCurrentScopeInCopy();
    const source = this._this.getDataByScope({
      leftTopCell: sourceCells.startCell,
      rightBottomCell: sourceCells.endCell
    });
    for (let row = sourceCells.startCell.row; row <= sourceCells.endCell.row; row++) {
      for (let column = sourceCells.startCell.column; column <= sourceCells.endCell.column; column++) {
        this._this._data.cells[row].cells[column] = createDefaultCell('1');
      }
    }
    for (let row = targetCells.leftTopCell.row; row <= targetCells.rightBottomCell.row; row++) {
      for (let column = targetCells.leftTopCell.column; column <= targetCells.rightBottomCell.column; column++) {
        this._this._data.cells[row].cells[column] = source[row - targetCells.leftTopCell.row][column - targetCells.leftTopCell.column];
        this._this._data.cells[row].cells[column] = source[row - targetCells.leftTopCell.row][column - targetCells.leftTopCell.column];
      }
    }

    this.selectPlugin.selectCells(targetCells)

  }
  private handleRegularCB() {

  }
}