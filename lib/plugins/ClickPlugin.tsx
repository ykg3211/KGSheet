// @ts-noc heck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginType } from ".";
import BaseMap from "../core/base/baseMap";
import { EventConstant } from "./event";
import EventStack, { eventStackType } from "./EventStack";

export default class ClickPlugin extends EventStack {
  private _this: BaseMap;
  private _mouseX: number;
  private _mouseY: number;

  constructor(_this: BaseMap) {
    super();
    this._this = _this;
    this.handleMouseClick();
    this.handleMouseDown();
    this.handleMouseUp();
  }

  private handleMouseDown() {
    const handler = (e: MouseEvent) => {
      this._this.emit(EventConstant.MOUSE_DOWN, [e.offsetX, e.offsetY])
    }
    document.body.addEventListener('mousedown', handler);

    this._this.on(EventConstant.DESTROY, () => {
      document.body.removeEventListener('mousedown', handler);
    });
  }
  private handleMouseUp() {
    const handler = (e: MouseEvent) => {
      this._this.emit(EventConstant.MOUSE_UP, [e.offsetX, e.offsetY])
    }
    document.body.addEventListener('mouseup', handler);

    this._this.on(EventConstant.DESTROY, () => {
      document.body.removeEventListener('mouseup', handler);
    });
  }
  private handleMouseClick() {
    const handler = (e: MouseEvent) => {
      this._this.emit(EventConstant.CLICK, [e.offsetX, e.offsetY])
    }
    document.body.addEventListener('click', handler);

    this._this.on(EventConstant.DESTROY, () => {
      document.body.removeEventListener('click', handler);
    });
  }
}