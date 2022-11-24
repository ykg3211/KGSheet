import { PluginTypeEnum } from '..';
import { cell } from '../../../interfaces';
import { debounce, deepClone, judgeCross } from '../../../utils';
import Base, { BaseDataType, selectedCellType } from '../../base/base';
import { EventConstant } from '../base/event';
import ExcelBaseFunction from '../EventStack';
import KeyBoardPlugin from '../KeyBoardPlugin';
import { BASE_KEYS_ENUM, CONTENT_KEYS, OPERATE_KEYS_ENUM } from '../KeyBoardPlugin/constant';

export class InputDom {
  private DOM: HTMLTextAreaElement;
  private _this: Base;
  private cell: selectedCellType;
  private ExcelBaseFunction!: ExcelBaseFunction;
  private KeyBoardPlugin!: KeyBoardPlugin;
  private minHeight!: number;
  private minWidth!: number;
  private enterEvent!: () => void;

  constructor(_this: Base, data: cell, cell: selectedCellType) {
    this._this = _this;
    this.DOM = document.createElement('textarea');
    this.cell = cell;
    this.setCommonStyle(data);
    this.stopPropagation();
    this.initPlugin();
    this.handleDomValue(data);

    (this._this.canvasDom as HTMLElement).parentElement?.appendChild(this.DOM);

    this.registerKeyboardEvent();

    setTimeout(() => {
      this.DOM?.focus();
    }, 0);
  }

  private initPlugin() {
    const ExcelBaseFunction = this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction);
    if (ExcelBaseFunction) {
      this.ExcelBaseFunction = ExcelBaseFunction;
    } else {
      console.error('InputDom 依赖于 ExcelBaseFunction, 请正确注册插件!');
    }

    const KeyBoardPlugin = this._this.getPlugin(PluginTypeEnum.KeyBoardPlugin);
    if (KeyBoardPlugin) {
      this.KeyBoardPlugin = KeyBoardPlugin;
      this.enterEvent = this._enterEvent.bind(this);
    } else {
      console.error('InputDom 依赖于 KeyBoardPlugin, 请正确注册插件!');
    }
  }

  private registerKeyboardEvent() {
    this.KeyBoardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Meta],
      mainKeys: [OPERATE_KEYS_ENUM.Enter],
      callbacks: [this.enterEvent],
    });
  }

  private _enterEvent() {
    console.log(1);
  }

  public inputInDom(mainKeys: any) {
    this.DOM?.oninput?.(mainKeys);
  }

  private setCommonStyle(originData: cell) {
    const cellStyle = originData.style;

    this.DOM.style.backgroundColor = cellStyle.backgroundColor ? cellStyle.backgroundColor : this._this.color('white');
    Object.keys(cellStyle).forEach((key) => {
      // @ts-ignore
      this.DOM.style[key] = cellStyle[key];
    });
    this.DOM.style.font = cellStyle.font || '';
    this.DOM.style.fontSize = (cellStyle.fontSize || 12) * this._this.scale + 'px';
    this.DOM.style.textAlign = cellStyle.textAlign || '';
    this.DOM.style.color = cellStyle.fontColor || this._this.color('black');
    this.DOM.style.position = 'absolute';
    this.DOM.style.top = '0px';
    this.DOM.style.left = '0px';
    this.DOM.style.outline = 'none';
    this.DOM.style.border = '1px solid #4a89fe';
    this.DOM.style.resize = 'none';
    this.DOM.style.overflow = 'hidden';
  }

  public resetEditDomPosition(x: number, y: number, w: number, h: number) {
    if (!this.DOM || !this._this.canvasDom) {
      return;
    }
    const { paddingLeft, paddingTop, width, height } = this._this;
    // @ts-ignore
    const { _scrollBarWidth = 10 } = this._this.getPlugin(PluginTypeEnum.ScrollPlugin);
    const contentX = paddingLeft + (this._this.canvasDom?.offsetLeft || 0);
    const contentY = paddingTop + (this._this.canvasDom?.offsetTop || 0);

    const display = judgeCross(
      [x, y, w, h],
      [contentX, contentY, width - paddingLeft - _scrollBarWidth, height - paddingTop - _scrollBarWidth],
    );

    x += 1;
    y += 1;
    x = Math.max(contentX, x);
    y = Math.max(contentY, y);

    x = Math.min(this._this.canvasDom.offsetLeft + width - _scrollBarWidth - w + 3, x);
    y = Math.min(this._this.canvasDom.offsetTop + height - _scrollBarWidth - h + 2, y);

    this.DOM.style.width = (w - 2) * this._this.scale + 'px';
    this.DOM.style.height = (h - 2) * this._this.scale + 'px';
    this.minWidth = (w - 2) * this._this.scale;
    this.minHeight = (h - 2) * this._this.scale;

    this.DOM.style.display = display ? 'block' : 'none';

    this.DOM.style.transform = `translate(${x}px, ${y}px)`;
    this.calcWidthHeight();
  }

  private handleDomValue(originData: cell) {
    this.DOM.value = originData.content;
    let preValue = this.DOM.value;
    const setEventStack = debounce((newV: string) => {
      const preCellData = this._this.getDataByScope({
        leftTopCell: this.cell,
        rightBottomCell: this.cell,
      });
      const afterCellData: BaseDataType = deepClone(preCellData);

      const spanCellKeys = Object.keys(preCellData.data.spanCells);
      if (spanCellKeys.length > 0) {
        preCellData.data.spanCells[spanCellKeys[0]].content = preValue;
        afterCellData.data.spanCells[spanCellKeys[0]].content = newV;
      } else {
        preCellData.data.cells[0][0].content = preValue;
        afterCellData.data.cells[0][0].content = newV;
      }

      this._this.emit(EventConstant.EXCEL_CHANGE);
      this.ExcelBaseFunction.cellsChange(
        {
          scope: {
            leftTopCell: this.cell,
            rightBottomCell: this.cell,
          },
          pre_data: preCellData.data,
          after_data: afterCellData.data,
          time_stamp: new Date(),
        },
        false,
      );

      preValue = newV;
    }, 300);

    this.DOM.oninput = (newV) => {
      if (typeof newV === 'string') {
        this.DOM.value = newV;
        originData.content = newV;
        setEventStack(this.DOM.value);
      } else {
        originData.content = this.DOM.value;
        setEventStack(this.DOM.value);
      }

      this.calcWidthHeight();
    };
  }

  private calcWidthHeight() {
    this.DOM.style.height = Math.max(this.DOM.scrollHeight, this.minHeight) + 'px';
  }

  private _stopPropagation(e: Event) {
    e.stopPropagation();
  }

  private _stopPropagation_arrow(e: KeyboardEvent) {
    const stopKeys: string[] = [
      ...[
        OPERATE_KEYS_ENUM.ArrowDown,
        OPERATE_KEYS_ENUM.ArrowLeft,
        OPERATE_KEYS_ENUM.ArrowRight,
        OPERATE_KEYS_ENUM.ArrowUp,
      ],
      ...Object.keys(CONTENT_KEYS),
    ];

    if (stopKeys.includes(e.key as any)) {
      e.stopPropagation();
    }
  }

  private stopPropagation() {
    this.DOM.addEventListener('mousedown', this._stopPropagation);
    this.DOM.addEventListener('mouseup', this._stopPropagation);
    this.DOM.addEventListener('keydown', this._stopPropagation_arrow);
    this.DOM.addEventListener('keyup', this._stopPropagation_arrow);
  }

  public remove() {
    this.DOM.removeEventListener('mousedown', this._stopPropagation);
    this.DOM.removeEventListener('mouseup', this._stopPropagation);
    this.DOM.removeEventListener('keydown', this._stopPropagation_arrow);
    this.DOM.removeEventListener('keyup', this._stopPropagation_arrow);

    this.KeyBoardPlugin.uninstall({
      baseKeys: [],
      mainKeys: [OPERATE_KEYS_ENUM.Enter],
      callbacks: [this.enterEvent],
    });
    this.DOM.remove();
  }
}
