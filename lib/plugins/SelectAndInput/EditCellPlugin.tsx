// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from "..";
import Base, { selectedCellType } from "../../core/base/base";
import { EventZIndex, RenderZIndex } from "../../core/base/constant";
import { cell } from "../../interfaces";
import { judgeCross } from "../../utils";
import { EventConstant } from "../event";
import SelectPowerPlugin from "./SelectPowerPlugin";

export default class EditCellPlugin {
  public name: string;
  private _this: Base;
  private selectPlugin: SelectPowerPlugin;
  private editDom: null | HTMLTextAreaElement;
  private editCell: null | selectedCellType

  constructor(_this: Base) {
    this.name = PluginTypeEnum.CommonInputPowerPlugin;
    this._this = _this;

    if (this._this[PluginTypeEnum.SelectPowerPlugin]) {
      this.selectPlugin = this._this[PluginTypeEnum.SelectPowerPlugin]
    } else {
      console.error('CommonInputPlugin 依赖于 SelectPowerPlugin, 请正确注册插件!');
    }

    this.initEvent();
    this.transformEditDom();
  }

  private transformEditDom() {
    this._this.addRenderFunction(RenderZIndex.TABLE_CELLS, [() => {
      console.log(1)
    }])
    this._this.on(EventConstant.SCROLL_CONTENT, ({ scrollTop, scrollLeft }) => {
      if (this.editCell && this.editDom && this._this.canvasDom) {
        console.log(scrollTop, scrollLeft);

        const position = this._this.getRectByCell(this.editCell);

        position[0] += this._this.canvasDom.offsetLeft;
        position[1] += this._this.canvasDom.offsetTop;

        this.resetEditDomPosition(this.editCell, position);
      }
    })
  }

  private initEvent() {
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


    // 处理鼠标悬浮改变样式的。  边框和右下角
    const handleOverCursor = (e: MouseEvent) => {

    }

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e);
        if (!point || !this.selectPlugin._borderPosition) {
          return;
        }

        // 只有输入框在视图内部才需要
        if (judgeCross([this.selectPlugin._borderPosition.anchor[0], this.selectPlugin._borderPosition.anchor[1], this.selectPlugin._borderPosition.w, this.selectPlugin._borderPosition.h], [0, 0, this._this.width, this._this.height])) {

        }

        return false
      },
      innerFunc: handleOverCursor.bind(this),
      outerFunc: () => {
        document.body.style.cursor = 'default';
      }
    })

  }

  private resetEditDomPosition(cell: selectedCellType, [x, y, w, h]: [number, number, number, number]) {
    if (!this.editDom) {
      return;
    }
    this.editDom.style.transform = `translate(${x + 1}px, ${y + 2}px)`;
  }

  private createEditBox(cell: selectedCellType, [x, y, w, h]: [number, number, number, number]) {
    if (this.editDom) {
      return;
    }
    const originData = this._this.getRealCell(cell);

    this.editDom = document.createElement('textarea');
    this.setCommonStyle(this.editDom, originData);
    this.stopPropagation(this.editDom);

    this.editDom.style.width = w - 2 + 'px';
    this.editDom.style.height = h - 4 + 'px';
    this.editDom.style.transform = `translate(${x + 1}px, ${y + 2}px)`;

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
    dom.style.border = 'none';
    dom.style.resize = 'none';
  }
}