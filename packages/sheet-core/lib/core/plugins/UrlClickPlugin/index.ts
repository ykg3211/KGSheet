import Base from '../../base/base';
import { PluginTypeEnum } from '..';
import KeyboardPlugin from '../KeyboardPlugin';
import SelectPowerPlugin from '../SelectAndInput/SelectPowerPlugin';
import { Align, Cell, CellStyle, CellTypeEnum, ExcelConfig, SpanCell } from '../../../interfaces';
import { CellCornerScopeType } from '../SelectAndInput/EditCellPlugin';
import { EventConstant } from '../base/event';
import { EventZIndex } from '../../base/constant';
import { isNN } from '../../../utils';

// 主要用于计算style
const INIT_V = 'init_v'; // 初始态
export const NOT_SAME = 'not_same'; // 一堆cell的属性不同的标志

export default class UrlClickPlugin {
  private _this: Base;
  public name: string;
  private KeyboardPlugin!: KeyboardPlugin;
  private SelectPowerPlugin!: SelectPowerPlugin;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.UrlClickPlugin;
    this._this = _this;

    this.register();
    this.initEvent();
  }

  private register() {
    const KeyboardPlugin = this._this.getPlugin(PluginTypeEnum.KeyboardPlugin);
    if (KeyboardPlugin) {
      this.KeyboardPlugin = KeyboardPlugin;
    }

    const SelectPowerPlugin = this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin);
    if (SelectPowerPlugin) {
      this.SelectPowerPlugin = SelectPowerPlugin;
    }
  }

  public getSameAttributes(data: ExcelConfig, scope: CellCornerScopeType) {
    const needAttrs: Array<keyof CellStyle> = [
      'textAlign',
      'backgroundColor',
      'fontWeight',
      'fontColor',
      'fontSize',
      'font',
      'deleteLine',
      'underLine',
      'italic',
    ];

    // @ts-ignore
    const attributes: Record<keyof CellStyle, any> = {};
    needAttrs.forEach((key) => {
      attributes[key] = INIT_V;
    });

    const skipMap: Record<string, boolean> = {};

    const commonHandleCell = (cell: Cell | SpanCell) => {
      needAttrs.forEach((attr) => {
        if (attributes[attr] === INIT_V) {
          attributes[attr] = cell.style[attr];
        } else if (attributes[attr] !== cell.style[attr]) {
          attributes[attr] = NOT_SAME;
        }
      });
    };

    Object.keys(data.spanCells).forEach((key) => {
      const spanCell = data.spanCells[key];
      const [w, h] = spanCell.span;
      const [row, column] = key.split('_').map(Number);

      for (let i = 0; i < h; i++) {
        for (let ii = 0; ii < w; ii++) {
          const key = `${row - scope.leftTopCell.row + i}_${column - scope.leftTopCell.column + ii}`;
          skipMap[key] = true;
        }
      }

      commonHandleCell(spanCell);
    });

    data.cells.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!skipMap[r + '_' + c]) {
          commonHandleCell(cell);
        }
      });
    });

    return attributes;
  }

  private initEvent() {
    // 处理鼠标悬浮改变样式的。
    const handleOverCursor = (
      e: MouseEvent & {
        _mouseY: number;
        _mouseX: number;
      },
      realCell: Cell,
    ) => {
      if (this._this.canvasDom) {
        this._this.canvasDom.style.cursor = 'pointer';
      }
    };

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e: any) => {
        if (!isNN(e._mouseY) && !isNN(e._mouseX)) {
          const cell = this._this.getCellByPoint([e._mouseX, e._mouseY]);
          if (cell) {
            const realCell = this._this.getRealCell(cell);
            if (realCell && realCell.type === CellTypeEnum.url) {
              return realCell;
            }
          }
        }
        return false;
      },
      // @ts-ignore
      innerFunc: handleOverCursor.bind(this),
      outerFunc: () => {
        if (this._this.canvasDom) {
          this._this.canvasDom.style.cursor = 'default';
        }
      },
    });

    const handleClick = (
      e: MouseEvent & {
        _mouseY: number;
        _mouseX: number;
      },
      realCell: Cell,
    ) => {
      if (realCell.content) {
        window.open(realCell.content);
      }
    };
    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e: MouseEvent) => {
        if (e) {
          const point = this._this.transformXYInContainer(e);
          if (!point) {
            return;
          }
          const cell = this._this.getCellByPoint(point);
          if (cell) {
            const realCell = this._this.getRealCell(cell);
            if (realCell && realCell.type === CellTypeEnum.url) {
              return realCell;
            }
          }
        }
        return false;
      },
      // @ts-ignore
      innerFunc: handleClick.bind(this),
    });
  }
}
