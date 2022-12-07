import { EventConstant } from './plugins/base/event';
import Base from './base/base';
import { ExcelConfig } from '../interfaces';
import { PluginTypeEnum } from './plugins';
import { isMacOS } from '../utils';

class Excel extends Base {
  constructor(dom: any) {
    super(dom);

    this.devMode && console.log('System: ' + isMacOS ? 'macos' : 'windows');
  }

  public getData() {}

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
    this.getPlugin(PluginTypeEnum.SelectPowerPlugin)?.clearStyle();
  }

  // 粗体
  public blodStyle() {
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.blod();
  }

  // 删除线
  public deleteLine() {
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.deleteLine();
  }

  // 斜体
  public italic() {
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.italic();
  }

  // 下划线
  public underLine() {
    this.getPlugin(PluginTypeEnum.FontEditPlugin)?.underLine();
  }

  // 合并单元格
  public combineCells() {
    this.getPlugin(PluginTypeEnum.EditCellPlugin)?.combineCells();
  }
}

export default Excel;
