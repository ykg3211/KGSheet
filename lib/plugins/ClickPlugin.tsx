// @ts-nocheck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginType } from ".";
import BaseMap from "../core/base/baseMap";
import { EventConstant } from "./event";

export default class ClickPlugin implements PluginType {
  private _this: BaseMap;

  constructor(_this: BaseMap) {
    this._this = _this;
    this.handleClick();
  }

  private remove() {
    //
  }

  private handleClick() {
    const handle = (e) => {
      console.log(e)
    }
    this._this.canvasDom?.removeEventListener('mousemove', handle);

    this._this.once(EventConstant.DESTROY, () => {
      this._this.canvasDom?.removeEventListener('mousemove', handle);
    });
  }
}