import { EventConstant } from './plugins/base/event';
import Base from './base/base';
import { excelConfig } from '../interfaces';
import { PluginTypeEnum } from './plugins';

class Excel extends Base {
  constructor(dom: any) {
    super(dom);
  }

  public getData() {}

  public setData(data: excelConfig) {
    if (data) {
      this.data = data;
    }
  }

  public destroy() {
    this.emit(EventConstant.DESTROY);
  }

  public reverse() {
    this.getPlugin(PluginTypeEnum.EventStack)?.reverse?.();
    this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
  }
  public anti_reverse() {
    this.getPlugin(PluginTypeEnum.EventStack)?.anti_reverse?.();
    this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
  }
}

export default Excel;
