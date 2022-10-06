import Base from "../core/base/base";
import ClickPlugin from "./ClickPlugin";
import EventStack from "./EventStack";
import MouseMovePlugin from "./MouseMovePlugin";
import ScrollPlugin from "./ScrollPlugin";
import SideBarResizePlugin from "./SideBarResizePlugin";

export enum PluginTypeEnum {
  EventStack = 'EventStack',
  MouseMovePlugin = 'MouseMovePlugin',
  ClickPlugin = 'ClickPlugin',
  ScrollPlugin = 'ScrollPlugin',
  SideBarResizePlugin = 'SideBarResizePlugin',
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
    this.register(PluginTypeEnum.EventStack, EventStack);

    // 鼠标移动的插件， 
    this.register(PluginTypeEnum.MouseMovePlugin, MouseMovePlugin);
    // 鼠标点击的全局插件， 
    this.register(PluginTypeEnum.ClickPlugin, ClickPlugin);
    // 全局的滚动条事件插件
    this.register(PluginTypeEnum.ScrollPlugin, ScrollPlugin);
    // 左上两个边框的改变宽度的插件
    this.register(PluginTypeEnum.SideBarResizePlugin, SideBarResizePlugin);
  }

  public register(name: string, Plugin: any) {
    if (this.pluginsArr[name]) {
      this.pluginsArr[name].remove?.();
    }

    this.pluginsArr[name] = new Plugin(this._this);
  }
}