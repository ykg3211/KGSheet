import Base from "../core/base/base";
import ClickPlugin from "./ClickPlugin";
import EventStack from "./EventStack";
import MouseMovePlugin from "./MouseMovePlugin";
import ScrollPlugin from "./ScrollPlugin";
import SideBarResizePlugin from "./SideBarResizePlugin";
import SelectPowerPlugin from "./SelectPowerPlugin";

export enum PluginTypeEnum {
  EventStack = 'EventStack',
  MouseMovePlugin = 'MouseMovePlugin',
  ClickPlugin = 'ClickPlugin',
  ScrollPlugin = 'ScrollPlugin',
  SideBarResizePlugin = 'SideBarResizePlugin',
  SelectPowerPlugin = 'SelectPowerPlugin',
}

export interface PluginType {
  _this: Base;
  remove?: () => void;
}

export default class Plugins {
  private _this: Base;
  private pluginsArr: Record<string, PluginType>;

  constructor(_this: Base) {
    this._this = _this;
    this.pluginsArr = {};
    // 全局的事件收集派发插件， 必须在第一个
    this.register(EventStack); // PluginTypeEnum.EventStack

    // 鼠标移动的插件， 
    this.register(MouseMovePlugin); // PluginTypeEnum.MouseMovePlugin
    // 鼠标点击的全局插件， 
    this.register(ClickPlugin); // PluginTypeEnum.ClickPlugin
    // 全局的滚动条事件插件
    this.register(ScrollPlugin); // PluginTypeEnum.ScrollPlugin
    // 左上两个边框的改变宽度的插件
    this.register(SideBarResizePlugin); // PluginTypeEnum.SideBarResizePlugin

    // 选中单元格插件
    this.register(SelectPowerPlugin); // PluginTypeEnum.SelectPowerPlugin
  }

  public deregistration(name?: string) {
    if (name) {
      this.pluginsArr[name].remove?.();
    } else {
      Object.values(this.pluginsArr).forEach(plugin => plugin.remove?.())
    }
  }

  public register(Plugin: any) {
    const newPlugin = new Plugin(this._this);
    const name = newPlugin.name;

    if (this.pluginsArr[name]) {
      this.pluginsArr[name].remove?.();
    }

    this.pluginsArr[name] = newPlugin;
    this._this['_' + name] = newPlugin;
  }
}