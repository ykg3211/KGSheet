// @ts-noche ck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginTypeEnum } from "..";
import Base, { selectedCellType } from "../../core/base/base";
import { EventZIndex, RenderZIndex } from "../../core/base/constant";
import { combineCell, combineRect, judgeCross } from "../../utils";
import { EventConstant } from "../base/event";
import { CellCornerScopeType, CellScopeType } from "./EditCellPlugin";

export interface borderType {
  anchor: [number, number],
  w: number,
  h: number
}

export interface cellPositionType {
  row: number;
  column: number;
}

export type selectedCellsType = selectedCellType[][]

export default class SelectPowerPlugin {
  public name: string;
  private _this: Base;

  public selectedCells: null | selectedCellsType;
  public cornerCells: CellScopeType | undefined;

  public selectCell: cellPositionType | null; // 真正选中的格子， 下面的是用来画框框的
  public _startCell: cellPositionType | null; // 选择 一开始的格子
  public _endCell: cellPositionType | null; // 选择 结尾的格子
  public _borderPosition: borderType | null | undefined; // 当前绘制的边框的位置信息

  private fillRectWidth: number;
  private strokeRectWidth: number;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.SelectPowerPlugin;
    this._this = _this;
    this._startCell = null;
    this._endCell = null;

    this._borderPosition = null;
    this.initCellClick();
    this.registerRenderFunc();
    this.fillRectWidth = 4;
    this.strokeRectWidth = 5;
  }

  public get isSelect() {
    return this._startCell && this._endCell;
  }

  public remove() {
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS, [])
  }

  private registerRenderFunc() {
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS, [(ctx) => {
      if (!this.isSelect) {
        return;
      }
      const border = this.calcBorder();
      this._borderPosition = border?.cellPosition;
      this.cornerCells = border?.cellScope;
      if (this._borderPosition) {
        this.drawSelectedBorder(ctx, this._borderPosition);
      }
    }])

    // 绘制选中单元格之后在X Y轴的映射线
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS_SIDEBAR_LINE, [(ctx) => {
      if (!this.isSelect) {
        return;
      }
      if (this._borderPosition) {
        this.drawSideBarLine(ctx, this._borderPosition);
      }
    }])
  }

  private initCellClick() {
    let isMouseDown_normalCell = false;
    let isMouseDown_top_Cell = false;
    let isMouseDown_left_Cell = false;
    const mouseDownCB = (e, point) => {
      const cell = this._this.getCellByPoint(point);
      if (!cell) {
        return;
      }
      this.selectCell = cell;
      if (cell.row !== -1 && cell.column !== -1) { // 正常开局，点的是中间的单元格
        this._startCell = cell;
        this._endCell = cell;

        isMouseDown_normalCell = true;

        this._this._render();
      } else if (cell.row === -1 && cell.column === -1) {  //点击了最左上角 全选
        this._startCell = {
          row: 0,
          column: 0
        }
        this._endCell = {
          row: this._this.data.h.length - 1,
          column: this._this.data.w.length - 1
        }
        this._this._render();
      } else if (cell.row === -1) {  //点击了上边框， 则选中一列
        this._startCell = {
          row: 0,
          column: cell.column
        }
        this._endCell = {
          row: this._this.data.h.length - 1,
          column: cell.column
        }
        isMouseDown_top_Cell = true;
        this._this._render();
      } else if (cell.column === -1) {  //点击了左边框， 则选中一行
        this._startCell = {
          row: cell.row,
          column: 0
        }
        this._endCell = {
          row: cell.row,
          column: this._this.data.w.length - 1
        }
        isMouseDown_left_Cell = true;
        this._this._render();
      }
    }

    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }

        return point;
      },
      innerFunc: mouseDownCB.bind(this),
      outerFunc: () => {
        // this.selectCell = null;
        // this._startCell = null;
        // this._endCell = null;
        // this._borderPosition = null;
        // this._this._render();
      },
    })

    const mouseMoveCB = (e, point) => {
      // 超过左边框还能识别的兼容
      const cell = this._this.getCellByPoint([Math.max(this._this.paddingLeft + 1, point[0]), Math.max(this._this.paddingTop + 1, point[1])]);
      if (!cell) {
        return;
      }

      if (isMouseDown_normalCell) {
        if (cell.row !== -1 && cell.column !== -1) {
          this._endCell = cell;
        } else if (cell.row === -1 && cell.column === -1) {
          this._endCell = {
            row: this._this.renderDataScope[0][0],
            column: this._this.renderDataScope[0][1],
          }
        } else if (cell.row === -1) {
          if (this._endCell) {
            this._endCell.column = cell.column;
          }
        } else if (cell.column === -1) {
          if (this._endCell) {
            this._endCell.row = cell.row;
          }
        }
      } else if (isMouseDown_top_Cell) {
        if (this._endCell) {
          this._endCell.column = cell.column
        }
      } else if (isMouseDown_left_Cell) {
        if (this._endCell) {
          this._endCell.row = cell.row
        }
      }

      this._this._render();
    }

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e, true);
        if (!point) {
          return false;
        }
        if (this._startCell && (isMouseDown_normalCell || isMouseDown_top_Cell || isMouseDown_left_Cell)) {
          return point;
        }
        return false;
      },
      innerFunc: mouseMoveCB.bind(this),
    })

    const moseUpCB = () => {
      isMouseDown_normalCell = false;
      isMouseDown_top_Cell = false;
      isMouseDown_left_Cell = false;
    }

    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: () => {
        if (this._startCell && (isMouseDown_normalCell || isMouseDown_top_Cell || isMouseDown_left_Cell)) {
          return true;
        }
        return false;
      },
      innerFunc: moseUpCB.bind(this),
    })


  }

  private calcBorder() {
    if (!(this._startCell && this._endCell)) {
      return;
    }
    let startCell: cellPositionType = {
      row: Math.min(this._startCell.row, this._endCell.row),
      column: Math.min(this._startCell.column, this._endCell.column),
    };
    let endCell: cellPositionType = {
      row: Math.max(this._startCell.row, this._endCell.row),
      column: Math.max(this._startCell.column, this._endCell.column),
    };

    const { _data, paddingLeft, paddingTop, scrollLeft, scrollTop, renderSpanCellsArr } = this._this;

    const cellPosition: borderType = {
      anchor: [
        _data.w.slice(0, startCell.column).reduce((a, b) => a + b, 0) + paddingLeft - scrollLeft,
        _data.h.slice(0, startCell.row).reduce((a, b) => a + b, 0) + paddingTop - scrollTop
      ],
      w: _data.w.slice(startCell.column, endCell.column + 1).reduce((a, b) => a + b, 0),
      h: _data.h.slice(startCell.row, endCell.row + 1).reduce((a, b) => a + b, 0),
    }

    const crossSpanCells: selectedCellType[] = [startCell, endCell];

    renderSpanCellsArr.forEach(cell => {
      if (judgeCross([cell.point[0], cell.point[1], cell.w, cell.h], [cellPosition.anchor[0], cellPosition.anchor[1], cellPosition.w, cellPosition.h])) {
        const temp = combineRect([cell.point[0], cell.point[1], cell.w, cell.h], [cellPosition.anchor[0], cellPosition.anchor[1], cellPosition.w, cellPosition.h]);

        crossSpanCells.push({
          row: cell.location.row,
          column: cell.location.column
        });
        crossSpanCells.push({
          row: cell.location.row + cell.cell.span[1] - 1,
          column: cell.location.column + cell.cell.span[0] - 1
        });

        cellPosition.anchor[0] = temp[0];
        cellPosition.anchor[1] = temp[1];
        cellPosition.w = temp[2];
        cellPosition.h = temp[3];
      }
    })

    if (crossSpanCells.length > 2) {
      const { leftTopCell, rightBottomCell } = combineCell(crossSpanCells);
      startCell = leftTopCell;
      endCell = rightBottomCell;
    }

    return {
      cellPosition,
      cellScope: {
        startCell,
        endCell
      } as CellScopeType
    };
  }

  private drawSideBarLine(ctx: CanvasRenderingContext2D, { anchor, w, h }: borderType) {
    ctx.strokeStyle = '#4a89fe'
    ctx.lineWidth = 3;
    // 画x轴
    ctx.beginPath();
    const x_1 = Math.max(anchor[0], this._this.paddingLeft);
    const x_2 = anchor[0] + w;
    if (x_2 > x_1) {
      ctx.moveTo(x_1, this._this.paddingTop);
      ctx.lineTo(x_2, this._this.paddingTop);
    }
    ctx.stroke();

    // 画y轴
    ctx.beginPath();
    const y_1 = Math.max(anchor[1], this._this.paddingTop);
    const y_2 = anchor[1] + h;
    if (y_2 > y_1) {
      ctx.moveTo(this._this.paddingLeft, y_1);
      ctx.lineTo(this._this.paddingLeft, y_2);
    }
    ctx.stroke();
  }

  private drawSelectedBorder(ctx: CanvasRenderingContext2D, { anchor, w, h }: borderType) {
    ctx.strokeStyle = '#4a89fe'
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.strokeRect(anchor[0], anchor[1], w, h);

    ctx.fillStyle = "rgba(74,137,254,0.05)";
    ctx.fillRect(anchor[0], anchor[1], w, h);

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1;
    ctx.fillStyle = '#4a89fe'
    ctx.fillRect(anchor[0] + w - this.fillRectWidth / 2, anchor[1] + h - this.fillRectWidth / 2, this.fillRectWidth, this.fillRectWidth);
    ctx.strokeRect(anchor[0] + w - this.strokeRectWidth / 2, anchor[1] + h - this.strokeRectWidth / 2, this.strokeRectWidth, this.strokeRectWidth);
  }

  public selectCells({ leftTopCell, rightBottomCell }: CellCornerScopeType) {
    this._startCell = leftTopCell;
    this._endCell = rightBottomCell;
  }
}