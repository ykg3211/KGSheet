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
}

export interface BaseCellsChangeEventStackType extends BaseCellChangeType {
  time_stamp: Date;
}

export interface BaseCellsMoveType {
  sourceData: BaseCellChangeType;
  targetData: BaseCellChangeType;
  time_stamp: Date;
}

export default class ExcelBaseFunction {
  public _this: Base;
  public name: string;
  public EventStackPlugin: BaseEventStack;

  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.ExcelBaseFunction;

    if (this._this[PluginTypeEnum.EventStack]) {
      this.EventStackPlugin = this._this[PluginTypeEnum.EventStack];
    } else {
      console.error('ExcelBaseFunction 依赖于 EventStack, 请正确注册插件!');
    }
  }

  public cells_change({
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
}