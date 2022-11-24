import Base from '../../base';
import { PluginTypeEnum } from '..';
import { ToolsEventConstant } from '../../interface';

export enum colorType {
  white = 'white',
  black = 'black',
}

export const darkColorSum: Record<colorType, string> = {
  [colorType.white]: '#2A2B2B',
  [colorType.black]: '#E9EBEA',
};

export const lightColorSum: Record<colorType, string> = {
  [colorType.white]: '#E9EBEA',
  [colorType.black]: '#2A2B2B',
};

export default class DarkMode {
  public name: string;
  private _this: Base;
  public _darkMode: boolean;
  public backgroundColor!: string;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.DarkMode;
    this._this = _this;

    this._darkMode = true;
  }
  get darkMode() {
    return this._darkMode;
  }

  set darkMode(v) {
    this._darkMode = v;
    this._this.sheet.toggleDarkMode(v);
    this._this.emit(ToolsEventConstant.REFRESH);
  }

  public toogleDarkMode() {
    this.darkMode = !this.darkMode;
    return this.darkMode;
  }

  public color(name: colorType, needReverse: boolean = false) {
    if (this._darkMode && !needReverse) {
      return darkColorSum[name] || '';
    }
    return lightColorSum[name] || '';
  }
}
