// @ts-nocheck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginType } from ".";
import BaseMap from "../core/base/baseMap";
import { EventConstant } from "./event";
import EventStack, { eventStackType } from "./EventStack";

export default class MouseMovePlugin extends EventStack {
  private _this: BaseMap;
  private _mouseX: number;
  private _mouseY: number;

  constructor(_this: BaseMap) {
    super();
    this._this = _this;
    this._mouseX = 0;
    this._mouseY = 0;
    this.handleMouseMove();
    this._this.on(EventConstant.MOUSE_HOVER_EVENT, (data: eventStackType) => {
      this.addEvent(data);
    })
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
      this.mouseY = e.offsetY;
      this.mouseX = e.offsetX;

      this.dispatchEvent([e.offsetX, e.offsetY]);

      this._this.emit(EventConstant.MOUSE_MOVE, [e.offsetX, e.offsetY]);
    }
    document.body.addEventListener('mousemove', handler);

    this._this.once(EventConstant.DESTROY, () => {
      document.body.removeEventListener('mousemove', handler);
    });
  }
}