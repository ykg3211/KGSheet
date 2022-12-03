// @ts-noc heck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginTypeEnum } from '..';
import Base from '../../base/base';
import { EventConstant } from '../base/event';

export default class ClickPlugin {
  private _this: Base;
  public name: string;

  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.ClickPlugin;

    this.commonRegisterEvent('dblclick', EventConstant.DB_CLICK);
    this.commonRegisterEvent('click', EventConstant.CLICK);
    this.commonRegisterEvent('mousedown', EventConstant.MOUSE_DOWN);
    this.commonRegisterEvent('mouseup', EventConstant.MOUSE_UP, true);

    this.commonRegisterEvent('touchstart', EventConstant.TOUCH_START);
    this.commonRegisterEvent('touchmove', EventConstant.TOUCH_MOVE);
    this.commonRegisterEvent('touchend', EventConstant.TOUCH_END, true);
  }

  private commonRegisterEvent(event: any, key: EventConstant, isOnDom?: boolean = false) {
    const handler = (e: MouseEvent) => {
      this._this.emit(key, e);
      this._this.dispatchEvent(key, e);
    };
    if (isOnDom) {
      document.body?.addEventListener(event, handler);
    } else {
      this._this.canvasDom?.addEventListener(event, handler);
    }

    this._this.on(EventConstant.DESTROY, () => {
      if (isOnDom) {
        document.body?.removeEventListener(event, handler);
      } else {
        this._this.canvasDom?.removeEventListener(event, handler);
      }
    });
  }
}
