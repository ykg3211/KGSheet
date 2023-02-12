import { ColorType } from '../../../core/base/drawLayer';
import { PluginTypeEnum } from '..';
import { Cell } from '../../../interfaces';
import { debounce, deepClone, judgeCellType, judgeCross } from '../../../utils';
import Base, { BaseDataType, SelectedCellType } from '../../base/base';
import { EventConstant, ToolsEventConstant } from '../base/event';
import ExcelBaseFunction from '../EventStack';
import KeyboardPlugin from '../KeyboardPlugin';
import { CONTENT_KEYS, META, OPERATE_KEYS_ENUM } from '../KeyboardPlugin/constant';

export class InputDom {
  public DOM: HTMLTextAreaElement;
  private _this: Base;
  private cell: SelectedCellType;
  private ExcelBaseFunction!: ExcelBaseFunction;
  private KeyboardPlugin!: KeyboardPlugin;
  private minHeight!: number;
  private minWidth!: number;
  private enterEvent!: () => void;

  constructor(
    _this: Base,
    data: Cell,
    cell: SelectedCellType,
    config?: {
      needFocus?: boolean;
    },
  ) {
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
      config?.needFocus && this.DOM?.focus();
    }, 0);
  }

  private initPlugin() {
    const ExcelBaseFunction = this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction);
    if (ExcelBaseFunction) {
      this.ExcelBaseFunction = ExcelBaseFunction;
    } else {
      console.error('InputDom 依赖于 ExcelBaseFunction, 请正确注册插件!');
    }

    const KeyboardPlugin = this._this.getPlugin(PluginTypeEnum.KeyboardPlugin);
    if (KeyboardPlugin) {
      this.KeyboardPlugin = KeyboardPlugin;
      this.enterEvent = this._enterEvent.bind(this);
    } else {
      console.error('InputDom 依赖于 KeyboardPlugin, 请正确注册插件!');
    }
  }

  private registerKeyboardEvent() {
    this.KeyboardPlugin.register({
      baseKeys: [META],
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

  private setCommonStyle(cell: Cell) {
    const cellStyle = cell.style;

    this.DOM.style.backgroundColor = cellStyle.backgroundColor
      ? cellStyle.backgroundColor
      : this._this.getColor(ColorType.white);
    Object.keys(cellStyle).forEach((key) => {
      // @ts-ignore
      this.DOM.style[key] = cellStyle[key];
    });
    this.DOM.style.font = cellStyle.font || '';
    this.DOM.style.fontStyle += cellStyle.italic && 'italic';
    this.DOM.style.fontSize = (cellStyle.fontSize || 12) * this._this.scale + 'px';
    this.DOM.style.fontWeight = cellStyle.fontWeight || 'normal';
    this.DOM.style.textAlign = cellStyle.textAlign || '';
    this.DOM.style.color = cellStyle.fontColor || this._this.getColor(ColorType.black);
    this.DOM.style.position = 'absolute';
    this.DOM.style.top = '0px';
    this.DOM.style.left = '0px';
    this.DOM.style.outline = 'none';
    this.DOM.style.border = '1px solid #4a89fe';
    this.DOM.style.resize = 'none';
    this.DOM.style.overflow = 'hidden';
    this.DOM.style.minWidth = '50px';

    const textDecoration = [];
    cell.style.deleteLine && textDecoration.push('line-through');
    cell.style.underLine && textDecoration.push('underline');
    this.DOM.style.textDecoration = textDecoration.join(' ');

    // 光标颜色
    this.DOM.style.caretColor = this._this.getColor(ColorType.black);
  }

  private setSize({ width, height }: { width?: number; height?: number }) {
    const maxWidth = this._this.width - this._this.paddingLeft - this._this.scrollBarWidth;
    const maxHeight = this._this.height - this._this.paddingTop - this._this.scrollBarWidth;
    if (width) {
      this.DOM.style.width = width + 'px';
      // this.DOM.style.width = Math.min(maxWidth, width) + 'px';
    }
    if (height) {
      this.DOM.style.height = height + 'px';
      // this.DOM.style.height = Math.min(maxHeight, height) + 'px';
    }
  }

  public resetEditDomPosition(x: number, y: number, w: number, h: number) {
    if (!this.DOM || !this._this.canvasDom) {
      return;
    }

    const { scale, paddingLeft: _paddingLeft, paddingTop: _paddingTop, _width, _height } = this._this;
    const domW = w - 2 * this._this.scale;
    const domH = h - 2 * this._this.scale;
    const paddingLeft = _paddingLeft * scale;
    const paddingTop = _paddingTop * scale;
    const _scrollBarWidth = this._this._scrollBarWidth || 10;
    const contentX = paddingLeft + (this._this.canvasDom?.offsetLeft || 0);
    const contentY = paddingTop + (this._this.canvasDom?.offsetTop || 0);

    x += 1 * this._this.scale;
    y += 1 * this._this.scale;
    x = Math.max(contentX, x);
    y = Math.max(contentY, y);

    x = Math.min(this._this.canvasDom.offsetLeft + _width - _scrollBarWidth - domW + 3, x);
    y = Math.min(this._this.canvasDom.offsetTop + _height - _scrollBarWidth - domH + 2, y);

    this.setSize({
      width: domW,
      height: domH,
    });
    this.minWidth = w - 2 * this._this.scale;
    this.minHeight = h - 2 * this._this.scale;

    this.DOM.style.transform = `translate(${x}px, ${y}px)`;

    this.calcWidthHeight();
  }

  private handleDomValue(originData: Cell) {
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
        originData.type = judgeCellType(originData.content);
        setEventStack(this.DOM.value);
      } else {
        originData.content = this.DOM.value;
        originData.type = judgeCellType(originData.content);
        setEventStack(this.DOM.value);
      }

      this.calcWidthHeight();
      this._this.ToolBar?.emit(ToolsEventConstant.SET_SHADOW_INPUT, this.DOM.value);
      this._this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
    };
  }

  private calcWidthHeight() {
    this.setSize({
      height: Math.max(this.DOM.scrollHeight, this.minHeight),
    });
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
        OPERATE_KEYS_ENUM.Delete,
        OPERATE_KEYS_ENUM.Backspace,
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
    this._this.devMode && console.log('remove: InputDom');
    this.DOM.removeEventListener('mousedown', this._stopPropagation);
    this.DOM.removeEventListener('mouseup', this._stopPropagation);
    this.DOM.removeEventListener('keydown', this._stopPropagation_arrow);
    this.DOM.removeEventListener('keyup', this._stopPropagation_arrow);

    this.KeyboardPlugin.uninstall({
      baseKeys: [],
      mainKeys: [OPERATE_KEYS_ENUM.Enter],
      callbacks: [this.enterEvent],
    });
    this.DOM.remove();
  }
}
