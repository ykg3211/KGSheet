// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from "..";
import Base, { selectedCellType } from "../../core/base/base";
import { EventZIndex, RenderZIndex } from "../../core/base/constant";
import { rectType } from "../../core/base/drawLayer";
import { cell } from "../../interfaces";
import { combineCell, judgeCross, judgeOver } from "../../utils";
import { EventConstant } from "../event";
import SelectPowerPlugin, { borderType } from "./SelectPowerPlugin";

export interface CellScopeType {
  startCell: selectedCellType;
  endCell: selectedCellType;
}

export default class EditCellPlugin {
  public name: string;
  private _this: Base;
  private selectPlugin: SelectPowerPlugin;
  private editDom: null | HTMLTextAreaElement;
  private editCell: null | selectedCellType;

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

      if (this.startCopyCell) {

      }
    }])
  }

  private calBorder(startCell: selectedCellType, endCell: selectedCellType) {
    const { _data, paddingLeft, paddingTop, scrollLeft, scrollTop, renderSpanCellsArr } = this._this;

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
    this._this.on(EventConstant.SCROLL_CONTENT, () => {
      if (this.editCell && this.editDom && this._this.canvasDom) {
        const position = this._this.getRectByCell(this.editCell);

        position[0] += this._this.canvasDom.offsetLeft;
        position[1] += this._this.canvasDom.offsetTop;

        this.resetEditDomPosition(...position);
      }
    })
  }

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
      return 'grab';
    }

    // 剩下的肯定是边框了
    return 'cell'
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
    const handleMouseDownCursor = (e: MouseEvent, type) => {
      const cells = this.selectPlugin.getCornerCell;
      if (!cells) {
        return;
      }

      const { leftTopCell, rightBottomCell } = cells;
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
    const handleOverCursor = (e: MouseEvent, type) => {
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
    const handleMouseUp = (e: MouseEvent, point) => {
      this.startCopyCell = null;
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

    x += 2;
    y += 1;
    x = Math.max(contentX, x)
    y = Math.max(contentY, y)

    x = Math.min(this._this.canvasDom.offsetLeft + width - _scrollBarWidth - w + 3, x)
    y = Math.min(this._this.canvasDom.offsetTop + height - _scrollBarWidth - h + 2, y)


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
    this.editDom.style.width = w - 3 + 'px';
    this.editDom.style.height = h - 2 + 'px';
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
    dom.style.fontSize = cellStyle.fontSize + 'px' || '12px';
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
}