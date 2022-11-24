import Base from '../base/base';
import ClickPlugin from './MousePlugin/ClickPlugin';
import EventDispatch from './base/EventDispatch';
import ExcelBaseFunction from './EventStack';
import MouseMovePlugin from './MousePlugin/MouseMovePlugin';
import ScrollPlugin from './MousePlugin/ScrollPlugin';
import SideBarResizePlugin from './SideBarResizePlugin';
import SelectPowerPlugin from './SelectAndInput/SelectPowerPlugin';
import EditCellPlugin from './SelectAndInput/EditCellPlugin';
import RightClickPlugin from './RightClickPlugin';
import KeyBoardPlugin from './KeyBoardPlugin';
import BaseEventStack from './EventStack/base';
import CopyAndPaste from './CopyAndPaste/CopyAndPaste';

export enum PluginTypeEnum {
  KeyBoardPlugin = 'KeyBoardPlugin',
  EventDispatch = 'EventDispatch',
  EventStack = 'EventStack',
  ExcelBaseFunction = 'ExcelBaseFunction',
  MouseMovePlugin = 'MouseMovePlugin',
  ClickPlugin = 'ClickPlugin',
  ScrollPlugin = 'ScrollPlugin',
  SideBarResizePlugin = 'SideBarResizePlugin',
  SelectPowerPlugin = 'SelectPowerPlugin',
  CommonInputPowerPlugin = 'CommonInputPowerPlugin',
  CopyAndPaste = 'CopyAndPaste',
  RightClickPlugin = 'RightClickPlugin',
}

export interface PluginType {
  [PluginTypeEnum.KeyBoardPlugin]?: KeyBoardPlugin;
  [PluginTypeEnum.EventDispatch]?: EventDispatch;
  [PluginTypeEnum.EventStack]?: BaseEventStack;
  [PluginTypeEnum.ExcelBaseFunction]?: ExcelBaseFunction;
  [PluginTypeEnum.MouseMovePlugin]?: MouseMovePlugin;
  [PluginTypeEnum.ClickPlugin]?: ClickPlugin;
  [PluginTypeEnum.ScrollPlugin]?: ScrollPlugin;
  [PluginTypeEnum.SideBarResizePlugin]?: SideBarResizePlugin;
  [PluginTypeEnum.SelectPowerPlugin]?: SelectPowerPlugin;
  [PluginTypeEnum.CommonInputPowerPlugin]?: EditCellPlugin;
  [PluginTypeEnum.CopyAndPaste]?: CopyAndPaste;
  [PluginTypeEnum.RightClickPlugin]?: RightClickPlugin;
}

export interface BasePluginType {
  _this: Base;
  remove?: () => void;
}

export default class Plugins {
  private _this: Base;

  constructor(_this: Base) {
    this._this = _this;
    // 全局的交互事件收集派发插件， 必须在第一个
    this.register(EventDispatch);
    // 全局的键盘事件派发插件
    this.register(KeyBoardPlugin);
    // 全局的编辑撤销翻撤销事件栈。
    this.register(BaseEventStack);
    this.register(ExcelBaseFunction);

    // 鼠标移动的插件，
    this.register(MouseMovePlugin);
    // 鼠标点击的全局插件，
    this.register(ClickPlugin);
    // 全局的滚动条事件插件
    this.register(ScrollPlugin);
    // 左上两个边框的改变宽度的插件
    this.register(SideBarResizePlugin);

    // 选中单元格插件
    this.register(SelectPowerPlugin);
    this.register(CopyAndPaste);

    // 选中之后输入单元格的插件
    this.register(EditCellPlugin);

    this.register(RightClickPlugin);
  }

  public deregister(name?: PluginTypeEnum) {
    if (name) {
      //@ts-ignore
      this._this.pluginsArr[name]?.remove?.();
    } else {
      Object.values(this._this.pluginsMap).forEach((plugin) => plugin.remove?.());
    }
  }

  public register(Plugin: any) {
    const newPlugin = new Plugin(this._this);
    const name = newPlugin.name as PluginTypeEnum;

    if (this._this.pluginsMap[name]) {
      //@ts-ignore
      this._this.pluginsMap[name]?.remove?.();
    }

    this._this.pluginsMap[name] = newPlugin;
  }
}
