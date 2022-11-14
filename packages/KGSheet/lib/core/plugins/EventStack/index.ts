import { PluginTypeEnum } from "..";
import Base from "../../base/base";
import { excelConfig } from "../../../interfaces";
import { CellCornerScopeType } from "../SelectAndInput/EditCellPlugin";
import SelectPowerPlugin from "../SelectAndInput/SelectPowerPlugin";
import BaseEventStack from "./base";
import { EventConstant } from "../base/event";

export interface BaseCellChangeType {
  scope: CellCornerScopeType;
  pre_data: excelConfig;
  after_data: excelConfig;
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
  private EventStackPlugin: BaseEventStack;

  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.ExcelBaseFunction;

    if (this._this[PluginTypeEnum.EventStack]) {
      this.EventStackPlugin = this._this[PluginTypeEnum.EventStack];
    } else {
      console.error('ExcelBaseFunction 依赖于 EventStack, 请正确注册插件!');
    }
  }

  private cells_change({
    scope,
    pre_data,
    after_data,
  }: BaseCellsChangeEventStackType, isReverse = false) {
    const after = isReverse ? pre_data : after_data;
    const pre = isReverse ? after_data : pre_data;

    Object.keys(pre.spanCells).forEach(spanCell => {
      delete this._this._data.spanCells[spanCell];
    })

    this._this.setDataByScope({
      scope,
      data: after
    });
    (this._this[PluginTypeEnum.SelectPowerPlugin] as SelectPowerPlugin)?.selectCells(scope);
    this._this.emit(EventConstant.EXCEL_CHANGE, {
      scope,
      pre_data,
      after_data,
    })
  }

  public cellsChange({
    scope,
    pre_data,
    after_data,
  }: BaseCellsChangeEventStackType, immediate = true) {
    this.EventStackPlugin.push([{
      params: {
        scope,
        pre_data,
        after_data,
        time_stamp: new Date()
      },
      func: this.cells_change.bind(this),
    }], immediate)
  }

  public cellsMove({
    sourceData,
    targetData,
    time_stamp,
  }: BaseCellsMoveType) {
    this.EventStackPlugin.push([{
      params: {
        ...sourceData,
        time_stamp
      },
      func: this.cells_change.bind(this)
    }, {
      params: {
        ...targetData,
        time_stamp
      },
      func: this.cells_change.bind(this)
    }])
  }

  private _rowColumnResize({
    isRow,
    index,
    preWidth,
    afterWidth,
  }: RowColumnResizeType, isReverse = false) {
    const after = isReverse ? preWidth : afterWidth;

    this._this._data[isRow ? 'h' : 'w'][index] = after;
    this._this.render();
  }

  public rowColumnResize(data: RowColumnResizeType) {
    const time_stamp = new Date();
    this.EventStackPlugin.push([{
      params: {
        ...data,
        time_stamp
      },
      func: this._rowColumnResize.bind(this)
    }])
  }
}