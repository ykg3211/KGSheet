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
    // ?????????????????????????????????????????? ??????????????????
    this.register(EventDispatch);
    // ?????????????????????????????????
    this.register(KeyboardPlugin);
    // ??????????????????????????????????????????
    this.register(BaseEventStack);
    this.register(ExcelBaseFunction);

    // sheet?????????????????????????????????
    this.register(BlurFocusReset);

    // ????????????????????????
    this.register(MouseMovePlugin);
    // ??????????????????????????????
    this.register(ClickPlugin);
    // ??????????????????????????????
    this.register(ScrollPlugin);
    // ??????????????????????????????????????????
    this.register(SideBarResizePlugin);

    // ?????????????????????
    this.register(SelectPowerPlugin);
    !this._this.config.readOnly && this.register(CopyAndPaste);

    // ????????????????????????????????????
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
      console.error(name + '????????????????????????');
      return;
    }

    this._this.pluginsMap[name] = newPlugin;
  }
}
