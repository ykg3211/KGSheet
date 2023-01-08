import { EventConstant } from './plugins/base/event';
import Base from './base/base';
import { Align, ExcelConfig, BaseSheetSetting, SheetSetting } from '../interfaces';
import { PluginTypeEnum } from './plugins';
import { isMacOS } from '../utils';

const defaultConfig: SheetSetting = {
  darkMode: 'auto',
  devMode: false,
  readOnly: false,
};

class Excel extends Base {
  constructor(config: BaseSheetSetting) {
    super({
      ...defaultConfig,
      ...config,
    });

    this.devMode && console.log('System: ' + isMacOS ? 'macos' : 'windows');
  }

  public getData() {
    return this.data;
  }

  public setData(data: ExcelConfig) {
    if (data) {
      this.data = data;
    }
  }

  public destroy() {
    this.emit(EventConstant.DESTROY);
  }

  // 撤销
  public reverse() {
    this.getPlugin(PluginTypeEnum.EventStack)?.reverse?.();
    this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
  }
  // 反撤销
  public anti_reverse() {
    this.getPlugin(PluginTypeEnum.EventStack)?.anti_reverse?.();
    this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
  }

  // 清除样式
  public clearStyle() {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.SelectPowerPlugin)?.clearStyle();
  }

  // 粗体
  public blodStyle() {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.blod();
  }

  // 粗体
  public setFontSize(v: number) {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.setFontSize(v);
  }

  // 删除线
  public deleteLine() {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.deleteLine();
  }

  // 斜体
  public italic() {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.italic();
  }

  // 下划线
  public underLine() {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.underLine();
  }

  // 合并单元格
  public combineCells() {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.combineCells();
  }

  // 对齐
  public textAlign(textAlign: Align) {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.textAlign(textAlign);
  }

  // 字体颜色 / 背景颜色
  public changeColor(color: string, isFont = true) {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.removeDom();
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.changeColor(color, isFont);
  }
}

export default Excel;
