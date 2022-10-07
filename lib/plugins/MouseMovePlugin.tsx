// @ts-noch ck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginTypeEnum } from ".";
import Base from "../core/base/base";
import { EventConstant } from "./event";

export enum MouseEventEnum {

}
export default class MouseMovePlugin {
  private _this: Base;
  public name: string;
  private _mouseX: number;
  private _mouseY: number;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.MouseMovePlugin;
    this._this = _this;
    this._mouseX = 0;
    this._mouseY = 0;
    this.handleMouseMove();
  }

  protected get mouseX() {
    return this._mouseX;
  }
  protected set mouseX(v: number) {
    this._this.mouseX = v;
    this._mouseX = v;
  }
  protected get mouseY() {
    return this._mouseY;
  }
  protected set mouseY(v: number) {
    this._this.mouseY = v;
    this._mouseY = v;
  }

  private handleMouseMove() {
    const handler = (e: MouseEvent) => {
      const result = this._this.transformXYInContainer(e);
      if (result) {
        this.mouseX = result[0];
        this.mouseY = result[1];
        e._mouseX = this.mouseX;
        e._mouseY = this.mouseY;
      }

      this._this.emit(EventConstant.MOUSE_MOVE, e);
      this._this.dispatchEvent(EventConstant.MOUSE_MOVE)(e);
    }
    document.body.addEventListener('mousemove', handler);

    this._this.once(EventConstant.DESTROY, () => {
      document.body.removeEventListener('mousemove', handler);
    });
  }
}