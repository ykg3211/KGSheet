import { deepClone } from '../../utils';
import Excel from '../../core';
import BaseEvent from '../../core/plugins/base/event';
import { BarSettingType, config, ToolsEnum, ToolsGroupType } from '../interface';
import getTools from '../tools';
import baseToolBarConfig from './baseConfig';

export default class Base extends BaseEvent {
  public sheet: Excel;
  protected Tools: ToolsGroupType[];
  protected ToolsMap: Record<string, any>;
  private _tag: number;
  constructor(sheet: Excel, config?: config) {
    super();
    this.sheet = sheet;

    this._tag = 0;
    this.Tools = [];
    this.ToolsMap = {};
    console.log(1);
    this.initTools(config?.barSetting || baseToolBarConfig);
  }

  private initTools(barSetting: BarSettingType) {
    console.log(deepClone(barSetting));
    const result: ToolsGroupType[] = [];
    deepClone(barSetting).forEach((g) => {
      const group: ToolsGroupType = {
        ...g,
        tools: g.tools.map(this.dispatchTools.bind(this)),
      };
      result.push(group);
    });
    this.Tools = result;
    console.log(result);
  }

  private dispatchTools(type: string) {
    if (!this.ToolsMap[type]) {
      const Tool = getTools(type);
      if (!Tool) {
        return;
      }
      this.ToolsMap[type] = new Tool({
        sheet: this.sheet,
        toolBar: this,
        key: 'sid_' + type + '_' + this._tag++,
      });
    }

    return this.ToolsMap[type];
  }
}
