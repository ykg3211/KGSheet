import Base from '../base';
import DarkMode from './DarkMode';

export enum ToolsPluginTypeEnum {
  DarkMode = 'DarkMode',
}

export interface PluginType {
  [ToolsPluginTypeEnum.DarkMode]?: DarkMode;
}

export interface BasePluginType {
  _this: Base;
  remove?: () => void;
}

export default class Plugins {
  private _this: Base;

  constructor(_this: Base) {
    this._this = _this;

    this.register(DarkMode);
  }

  public deregister(name?: ToolsPluginTypeEnum) {
    if (name) {
      //@ts-ignore
      this._this.pluginsMap[name]?.remove?.();
    } else {
      Object.values(this._this.pluginsMap).forEach((plugin) => plugin.remove?.());
    }
  }

  public register(Plugin: any) {
    const newPlugin = new Plugin(this._this);
    const name = newPlugin.name as ToolsPluginTypeEnum;

    if (this._this.pluginsMap[name]) {
      console.error(name + '：插件重复注册！');
      return;
    }

    this._this.pluginsMap[name] = newPlugin;
  }
}
