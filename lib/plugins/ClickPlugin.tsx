// @ts-noc heck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import Base from "../core/base/base";
import { EventConstant } from "./event";

export default class ClickPlugin {
  private _this: Base;

  constructor(_this: Base) {
    this._this = _this;
    this.handleMouseClick();
    this.handleMouseDown();
    this.handleMouseUp();
  }

  private handleMouseDown() {
    const handler = (e: MouseEvent) => {
      this._this.emit(EventConstant.MOUSE_DOWN, e)
      this._this.dispatchEvent(EventConstant.MOUSE_DOWN)(e);
    }
    document.body.addEventListener('mousedown', handler);

    this._this.on(EventConstant.DESTROY, () => {
      document.body.removeEventListener('mousedown', handler);
    });
  }
  private handleMouseUp() {
    const handler = (e: MouseEvent) => {
      this._this.emit(EventConstant.MOUSE_UP, e)
      this._this.dispatchEvent(EventConstant.MOUSE_UP)(e);
    }
    document.body.addEventListener('mouseup', handler);

    this._this.on(EventConstant.DESTROY, () => {
      document.body.removeEventListener('mouseup', handler);
    });
  }
  private handleMouseClick() {
    const handler = (e: MouseEvent) => {
      this._this.emit(EventConstant.CLICK, e)
    }
    document.body.addEventListener('click', handler);

    this._this.on(EventConstant.DESTROY, () => {
      document.body.removeEventListener('click', handler);
    });
  }
}