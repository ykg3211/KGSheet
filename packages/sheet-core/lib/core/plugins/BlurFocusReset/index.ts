import Base from '../../base/base';
import { PluginTypeEnum } from '..';
import { EventConstant } from '../base/event';

export default class BlurFocusReset {
  private _this: Base;
  public name: string;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.BlurFocusReset;
    this._this = _this;

    this.windowBlur();
  }

  private windowBlur() {
    window.onblur = () => {
      this._this.emit(EventConstant.BLUR_FOCUS_RESET_PARAMS, false);
    };
    window.onfocus = () => {
      this._this.emit(EventConstant.BLUR_FOCUS_RESET_PARAMS, true);
    };
  }
}
