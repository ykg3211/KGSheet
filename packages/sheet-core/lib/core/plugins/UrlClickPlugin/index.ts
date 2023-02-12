import Base from '../../base/base';
import { PluginTypeEnum } from '..';
import KeyboardPlugin from '../KeyboardPlugin';
import SelectPowerPlugin from '../SelectAndInput/SelectPowerPlugin';
import { Align, Cell, CellStyle, CellTypeEnum, ExcelConfig, SpanCell } from '../../../interfaces';
import { CellCornerScopeType } from '../SelectAndInput/EditCellPlugin';
import { EventConstant } from '../base/event';
import { EventZIndex } from '../../base/constant';
import { isNN, judgeOver } from '../../../utils';

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

  private judgeInUrl(point: [number, number]) {
    const { cell, cellLoaction } = this._this.getCellByPoint(point);
    if (cell && cellLoaction) {
      const realCell = this._this.getRealCell(cell);
      if (realCell && this._this.ctx && realCell.type === CellTypeEnum.url) {
        this._this.ctx.save();
        this._this.ctx.font = `${realCell.style.fontWeight || 'normal'} ${realCell.style.italic ? 'italic' : ''} ${
          realCell.style.fontSize
        }px ${realCell.style.font || 'Arial'}`;
        const width = (this._this.ctx?.measureText(realCell.content).width || 0) * this._this.scale;
        const height = realCell.style.fontSize || 12;
        this._this.ctx.restore();

        let left = cellLoaction.point[0];
        const right = cellLoaction.point[1] + this._this.data.h[cell.row] / 2 - height / 2;
        if (realCell.style.textAlign === 'center') {
          left += Math.max((this._this.data.w[cell.column] - width) / 2, 0);
        } else if (realCell.style.textAlign === 'right') {
          left += Math.max(this._this.data.w[cell.column] - width, 0);
        }

        const isOverUrl = judgeOver(point, [left, right, width, height]);
        return isOverUrl ? realCell : null;
      }
    }
    return null;
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
          const cell = this.judgeInUrl([e._mouseX, e._mouseY]);
          if (cell) {
            return cell;
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
          const cell = this.judgeInUrl(point);
          if (cell) {
            return cell;
          }
        }
        return false;
      },
      // @ts-ignore
      innerFunc: handleClick.bind(this),
    });
  }
}
