// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from "..";
import Base from "../../base/base";

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
    }

    this._this.canvasDom.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        console.log(e.button)
        e.preventDefault()
      }
    })
  }
}