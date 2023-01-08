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
import KeyboardPlugin from './KeyboardPlugin';
import BaseEventStack from './EventStack/base';
import CopyAndPaste from './CopyAndPaste/CopyAndPaste';
import BlurFocusReset from './BlurFocusReset';
import FontEditPlugin from './FontEditPlugin';
import CornerAutoMove from './CornerAutoMove';
import RightClickPanelPlugin from '../../rightClickPanel';

export enum PluginTypeEnum {
  KeyboardPlugin = 'KeyboardPlugin',
  EventDispatch = 'EventDispatch',
  EventStack = 'EventStack',
  ExcelBaseFunction = 'ExcelBaseFunction',
  MouseMovePlugin = 'MouseMovePlugin',
  ClickPlugin = 'ClickPlugin',
  ScrollPlugin = 'ScrollPlugin',
  SideBarResizePlugin = 'SideBarResizePlugin',
  SelectPowerPlugin = 'SelectPowerPlugin',
  EditCellPlugin = 'EditCellPlugin',
  CopyAndPaste = 'CopyAndPaste',
  RightClickPlugin = 'RightClickPlugin',
  RightClickPanelPlugin = 'RightClickPanelPlugin',
  BlurFocusReset = 'BlurFocusReset',
  FontEditPlugin = 'FontEditPlugin',
  CornerAutoMove = 'CornerAutoMove',
}

export interface PluginType {
  [PluginTypeEnum.KeyboardPlugin]?: KeyboardPlugin;
  [PluginTypeEnum.EventDispatch]?: EventDispatch;
  [PluginTypeEnum.EventStack]?: BaseEventStack;
  [PluginTypeEnum.ExcelBaseFunction]?: ExcelBaseFunction;
  [PluginTypeEnum.MouseMovePlugin]?: MouseMovePlugin;
  [PluginTypeEnum.ClickPlugin]?: ClickPlugin;
  [PluginTypeEnum.ScrollPlugin]?: ScrollPlugin;
  [PluginTypeEnum.SideBarResizePlugin]?: SideBarResizePlugin;
  [PluginTypeEnum.SelectPowerPlugin]?: SelectPowerPlugin;
  [PluginTypeEnum.EditCellPlugin]?: EditCellPlugin;
  [PluginTypeEnum.CopyAndPaste]?: CopyAndPaste;
  [PluginTypeEnum.RightClickPlugin]?: RightClickPlugin;
  [PluginTypeEnum.RightClickPanelPlugin]?: RightClickPanelPlugin;
  [PluginTypeEnum.BlurFocusReset]?: BlurFocusReset;
  [PluginTypeEnum.FontEditPlugin]?: FontEditPlugin;
  [PluginTypeEnum.CornerAutoMove]?: CornerAutoMove;
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
    this.register(KeyboardPlugin);
    // 全局的编辑撤销翻撤销事件栈。
    this.register(BaseEventStack);
    this.register(ExcelBaseFunction);

    // sheet失焦之后重制某些状态的
    this.register(BlurFocusReset);

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
    !this._this.config.readOnly && this.register(CopyAndPaste);

    // 选中之后输入单元格的插件
    !this._this.config.readOnly && this.register(EditCellPlugin);

    this.register(RightClickPlugin);
    this.register(RightClickPanelPlugin);

    !this._this.config.readOnly && this.register(FontEditPlugin);

    this.register(CornerAutoMove);
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
      console.error(name + '：插件重复注册！');
      return;
    }

    this._this.pluginsMap[name] = newPlugin;
  }
}
