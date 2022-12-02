import { PluginTypeEnum } from '..';
import Base from '../../base/base';
import { ExcelConfig } from '../../../interfaces';
import { CellCornerScopeType } from '../SelectAndInput/EditCellPlugin';
import BaseEventStack from './base';
import { EventConstant } from '../base/event';

export interface BaseCellChangeType {
  scope: CellCornerScopeType;
  pre_data: ExcelConfig;
  after_data: ExcelConfig;
  time_stamp?: Date;
}

export interface BaseCellsChangeEventStackType extends BaseCellChangeType {
  time_stamp?: Date;
}

export interface BaseCellsMoveType {
  sourceData: BaseCellChangeType;
  targetData: BaseCellChangeType;
  time_stamp: Date;
}

export interface RowColumnResizeType {
  isRow: boolean;
  index: number;
  preWidth: number;
  afterWidth: number;
}

export default class ExcelBaseFunction {
  private _this: Base;
  private name: string;
  private EventStackPlugin!: BaseEventStack;

  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.ExcelBaseFunction;

    const EventStack = this._this.getPlugin(PluginTypeEnum.EventStack);
    if (EventStack) {
      this.EventStackPlugin = EventStack;
    } else {
      console.error('ExcelBaseFunction 依赖于 EventStack, 请正确注册插件!');
    }
  }

  private cells_change({ scope, pre_data, after_data }: BaseCellChangeType, isReverse = false) {
    const after = isReverse ? pre_data : after_data;
    const pre = isReverse ? after_data : pre_data;

    Object.keys(pre.spanCells).forEach((spanCell) => {
      delete this._this._data.spanCells[spanCell];
    });

    this._this.setDataByScope({
      scope,
      data: after,
    });

    this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin)?.selectCells(scope);
    this._this.emit(EventConstant.EXCEL_CHANGE, {
      scope,
      pre_data,
      after_data,
    });
  }

  public cellsChange({ scope, pre_data, after_data }: BaseCellsChangeEventStackType, immediate = true) {
    this.EventStackPlugin.push(
      [
        {
          params: {
            scope,
            pre_data,
            after_data,
            time_stamp: new Date(),
          },
          // @ts-ignore
          func: this.cells_change.bind(this),
        },
      ],
      immediate,
    );
  }

  public cellsMove({ sourceData, targetData, time_stamp }: BaseCellsMoveType) {
    this.EventStackPlugin.push([
      {
        params: {
          ...sourceData,
          time_stamp,
        },
        // @ts-ignore
        func: this.cells_change.bind(this),
      },
      {
        params: {
          ...targetData,
          time_stamp,
        },
        // @ts-ignore
        func: this.cells_change.bind(this),
      },
    ]);
  }

  private _rowColumnResize({ isRow, index, preWidth, afterWidth }: RowColumnResizeType, isReverse = false) {
    const after = isReverse ? preWidth : afterWidth;

    this._this._data[isRow ? 'h' : 'w'][index] = after;
    this._this.render();
  }

  public rowColumnResize(data: RowColumnResizeType) {
    const time_stamp = new Date();
    this.EventStackPlugin.push([
      {
        params: {
          ...data,
          time_stamp,
        },
        // @ts-ignore
        func: this._rowColumnResize.bind(this),
      },
    ]);
  }
}
