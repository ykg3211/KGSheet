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
  private media: MediaQueryList;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.DarkMode;
    this._this = _this;

    this.media = window.matchMedia('(prefers-color-scheme: dark)');

    this.media.addEventListener('change', (e) => {
      this.darkMode = e.matches || false;
    });

    this._darkMode = this.media.matches || false;
  }
  get darkMode() {
    return this._darkMode;
  }

  set darkMode(v) {
    this._darkMode = v;
    this._this.sheet.toggleDarkMode(v);
    this._this.emit(ToolsEventConstant.REFRESH);
  }

  public toogleDarkMode(dark?: boolean) {
    if (dark === undefined) {
      this.darkMode = !this.darkMode;
    } else {
      this.darkMode = dark;
    }
    return this.darkMode;
  }

  public color(name: colorType, needReverse: boolean = false) {
    if (this._darkMode && !needReverse) {
      return darkColorSum[name] || '';
    }
    return lightColorSum[name] || '';
  }
}
