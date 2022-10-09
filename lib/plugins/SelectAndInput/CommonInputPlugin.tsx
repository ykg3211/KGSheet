// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from "..";
import Base from "../../core/base/base";
import SelectPowerPlugin from "./SelectPowerPlugin";

export default class CommonInputPlugin {
  public name: string;
  private _this: Base;
  private selectPlugin: SelectPowerPlugin

  constructor(_this: Base) {
    this.name = PluginTypeEnum.CommonInputPowerPlugin;
    this._this = _this;

    if (this._this['_' + PluginTypeEnum.SelectPowerPlugin]) {
      this.selectPlugin = this._this['_' + PluginTypeEnum.SelectPowerPlugin]
    } else {
      console.error('CommonInputPlugin 依赖于 SelectPowerPlugin, 请正确注册插件!');
    }
  }
}