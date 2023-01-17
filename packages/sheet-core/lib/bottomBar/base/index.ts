import { deepClone } from '../../utils';
import Excel from '../../core';
import BaseEvent, { ToolsEventConstant } from '../../core/plugins/base/event';
import { BarSettingType, config } from '../interface';
import getTools, { ToolsEnum, ToolsMapType } from '../tools';
import baseToolBarConfig from './baseConfig';
import Plugins, { PluginType, ToolsPluginTypeEnum } from '../plugins';
import { BaseTool } from '../tools/base';

export default class Base extends BaseEvent {
  public sheet: Excel;
  protected Tools: BaseTool[][];
  protected ToolsMap: Partial<Record<ToolsEnum, any>>;
  private _tag: number;
  public pluginsInstance: Plugins;
  public pluginsMap: PluginType;

  constructor(sheet: Excel, config?: config) {
    super();
    this.sheet = sheet;
    this._tag = 0;
    this.Tools = [];
    this.ToolsMap = {};

    this.pluginsMap = {};
    this.pluginsInstance = new Plugins(this);

    this.initTools(config?.barSetting || baseToolBarConfig);
  }

  private initTools(barSetting: BarSettingType) {
    this.Tools = deepClone(barSetting).map((tools) => {
      return tools.map((t) => {
        return this.dispatchTools(t);
      });
    });
  }

  public getPlugin<T extends ToolsPluginTypeEnum>(name: T): PluginType[T] {
    return this.pluginsMap[name];
  }

  public getTool<T extends ToolsEnum>(type: T) {
    return this.ToolsMap[type] as ToolsMapType[T];
  }

  private dispatchTools(type: ToolsEnum) {
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

  public refresh() {
    this.emit(ToolsEventConstant.REFRESH);
  }
}
