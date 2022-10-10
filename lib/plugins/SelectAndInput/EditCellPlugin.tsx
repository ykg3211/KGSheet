// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from "..";
import Base, { selectedCellType } from "../../core/base/base";
import { EventZIndex, RenderZIndex } from "../../core/base/constant";
import { cell } from "../../interfaces";
import { EventConstant } from "../event";
import SelectPowerPlugin from "./SelectPowerPlugin";

export default class EditCellPlugin {
  public name: string;
  private _this: Base;
  private selectPlugin: SelectPowerPlugin;
  private editDom: null | HTMLTextAreaElement

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
  }

  private initEvent() {
    const dbClickCB = (e, cell: {
      row: number,
      column: number
    }) => {
      if (this._this.canvasDom) {
        const position = this._this.getRectByCell(cell);

        position[0] += this._this.canvasDom.offsetLeft;
        position[1] += this._this.canvasDom.offsetTop;

        this.createEditBox(cell, position);
      }
    }
    this._this.setEvent(EventConstant.DB_CLICK, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e, true);
        if (!point) {
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
    dom.style.fontSize = cellStyle.fontSize + 'px' || '12px';
    dom.style.font = cellStyle.font || '';
    dom.style.textAlign = cellStyle.align || '';
    dom.style.color = cellStyle.fontColor || '';
    dom.style.position = 'absolute';
    dom.style.top = '0px';
    dom.style.left = '0px';
    dom.style.outline = 'none';
    dom.style.border = 'none';
    dom.style.resize = 'none';
  }
}