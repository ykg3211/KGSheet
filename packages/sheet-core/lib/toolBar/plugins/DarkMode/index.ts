import Base from '../../base';
import { ToolsPluginTypeEnum } from '..';
import { EventConstant, ToolsEventConstant } from '../../../core/plugins/base/event';

export enum toolBarColorType {
  white = 'white',
  black = 'black',
}

export const lightColorSum: Record<toolBarColorType, string> = {
  [toolBarColorType.white]: '#E9EBEA',
  [toolBarColorType.black]: '#2A2B2B',
};

export const darkColorSum: Record<toolBarColorType, string> = {
  [toolBarColorType.white]: '#2A2B2B',
  [toolBarColorType.black]: '#E9EBEA',
};

export default class DarkMode {
  public name: string;
  private _this: Base;
  public backgroundColor!: string;

  constructor(_this: Base) {
    this.name = ToolsPluginTypeEnum.DarkMode;
    this._this = _this;
  }

  public toogleDarkMode(dark?: boolean) {
    this._this.sheet.toggleDarkMode(dark);
    return this._this.sheet.darkMode;
  }

  public color(name: toolBarColorType, needReverse: boolean = false) {
    if (this._this.sheet.darkMode && !needReverse) {
      return darkColorSum[name] || '';
    }
    return lightColorSum[name] || '';
  }
}
