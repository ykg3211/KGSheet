import BaseMap from "../core/base/baseMap";
import ClickPlugin from "./ClickPlugin";
import MousePlugin from "./MouseMovePlugin";
import ScrollPlugin from "./ScrollPlugin";

export interface PluginType {
  _this: BaseMap;
  remove?: () => void;
}

export default class Plugins {
  private _this: BaseMap;
  private pluginsArr: Record<string, PluginType>;

  constructor(_this: BaseMap) {
    this._this = _this;
    this.pluginsArr = {};

    this.register('MousePlugin', MousePlugin);
    this.register('ClickPlugin', ClickPlugin);

    this.register('ScrollPlugin', ScrollPlugin);
  }

  public register(name: string, Plugin: any) {
    if (this.pluginsArr[name]) {
      this.pluginsArr[name].remove?.();
    }

    this.pluginsArr[name] = new Plugin(this._this);
  }
}