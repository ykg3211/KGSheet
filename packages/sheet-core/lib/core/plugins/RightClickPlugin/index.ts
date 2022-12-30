import { PluginTypeEnum } from '..';
import Base from '../../base/base';
import { EventConstant } from '../base/event';

export default class RightClickPlugin {
  public name: string;
  private _this: Base;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.RightClickPlugin;
    this._this = _this;
    this.initEvent();
  }

  private initEvent() {
    if (!this._this.canvasDom) {
      return;
    }
    this._this.canvasDom.oncontextmenu = function (e) {
      e.preventDefault();
    };

    this._this.canvasDom.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        e.preventDefault();
        this._this.emit(EventConstant.RIGHT_CLICK, e);
      }
    });
  }
}
