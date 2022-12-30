import { EventConstant } from '../core/plugins/base/event';
import { PluginTypeEnum } from '../core/plugins';
import Base from '../core/base/base';

export default class RightClickPanelPlugin {
  public name: string;
  private _this: Base;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.RightClickPanelPlugin;
    this._this = _this;
    this.initEvent();
  }

  private initEvent() {
    this._this.on(EventConstant.RIGHT_CLICK, (e) => {
      if (!e) {
        return;
      }
      const point = this._this.transformXYInContainer(e);
      if (!point) {
        return false;
      }

      this._this.devMode && console.log('RightClick');
      this.handleCell(point);
    });
  }

  private handleCell(point: [number, number]) {
    const cell = this._this.getCellByPoint(point);

    console.log(cell);
  }
}
