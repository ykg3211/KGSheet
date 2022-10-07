// @ts-noche ck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginTypeEnum } from ".";
import Base from "../core/base/base";
import { EventZIndex, RenderZIndex } from "../core/base/constant";
import { renderCellProps } from "../interfaces";
import judgeOver from "../utils/judgeHover";
import { EventConstant } from "./event";

export interface selectedCellType {
  row: number,
  column: number
}

export type selectedCellsType = selectedCellType[][]

export default class SelectPowerPlugin {
  public name: string;
  private _this: Base;
  public selectedCells: null | selectedCellsType;
  private fillRectWidth: number;
  private strokeRectWidth: number;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.SelectPowerPlugin;
    this._this = _this;
    this.initCellClick();
    this.registerRenderFunc();
    this.fillRectWidth = 4;
    this.strokeRectWidth = 5;
  }

  public remove() {
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS, [])
  }

  private registerRenderFunc() {
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS, [(ctx) => {
      this.renderFunction?.(ctx);
    }])
  }

  private renderFunction(ctx: CanvasRenderingContext2D) {
    if (!this.selectedCells) {
      return;
    }
    this.drawSelectedBorder(ctx);
  }

  private initCellClick() {
    const mouseDownCB = (e, point) => {
      const cell = this.calcPosition(point);
      this.selectedCells = cell ? [[cell]] : null;
      this._this._render();
    }

    this._this.setEvent(EventConstant.MOUSE_DOWN)({
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }

        return point;
      },
      innerFunc: mouseDownCB.bind(this),
      outerFunc: (e) => {
      },
    })
  }

  private calcPosition(point: [number, number]) {
    const { renderCellsArr, renderSpanCellsArr } = this._this as Base;

    let selectedCell: selectedCellType | null = null;
    renderSpanCellsArr.forEach(item => {
      if (judgeOver(point, [item.point[0], item.point[1], item.w, item.h])) {
        selectedCell = {
          row: item.location.row,
          column: item.location.column,
        };
      }
    })
    if (selectedCell) {
      return selectedCell;
    }
    renderCellsArr.some(row => {
      if (row.length > 0) {
        if (point[1] > row[0].point[1] && point[1] < (row[0].point[1] + row[0].h)) {
          row.some(cell => {
            if (judgeOver(point, [cell.point[0], cell.point[1], cell.w, cell.h])) {
              selectedCell = {
                row: cell.location.row,
                column: cell.location.column,
              };
              cell.location
              return true;
            }
            return false
          })
          return true;
        }
      }
      return false;
    })
    return selectedCell as selectedCellType | null;
  }

  private drawSelectedBorder(ctx: CanvasRenderingContext2D) {
    if (!this.selectedCells) {
      return;
    }
    const { renderDataScope, renderSpanCellsArr, renderCellsArr } = this._this;
    const [[startRow, startColumn]] = renderDataScope;
    const selectedCells = this.selectedCells.map(row => {
      return row.map(cell => {
        const spanCellsFilter = renderSpanCellsArr.filter(c => c.location.row === cell.row && c.location.column === cell.column)
        if (spanCellsFilter.length) {
          return spanCellsFilter[0];
        }
        if (cell.row - startRow > 0 && cell.column - startColumn > 0 &&
          cell.row - startRow < renderCellsArr.length && cell.column - startColumn < renderCellsArr[0].length) {
          return renderCellsArr[cell.row - startRow][cell.column - startColumn]
        }
        return null;
      })
    })
    if (selectedCells.flat().length === 0) {
      return;
    }
    const temp = selectedCells[0][0];
    if (!temp) {
      return;
    }
    const anchor = temp.point;
    let w = temp.w;
    let h = temp.h;

    ctx.strokeStyle = '#4a89fe'
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(anchor[0], anchor[1]);
    ctx.lineTo(anchor[0] + w, anchor[1])
    ctx.lineTo(anchor[0] + w, anchor[1] + h)
    ctx.lineTo(anchor[0], anchor[1] + h)
    ctx.lineTo(anchor[0], anchor[1])
    ctx.stroke();

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1;
    ctx.fillStyle = '#4a89fe'
    ctx.fillRect(anchor[0] + w - this.fillRectWidth / 2, anchor[1] + h - this.fillRectWidth / 2, this.fillRectWidth, this.fillRectWidth);
    ctx.strokeRect(anchor[0] + w - this.strokeRectWidth / 2, anchor[1] + h - this.strokeRectWidth / 2, this.strokeRectWidth, this.strokeRectWidth);
  }
}