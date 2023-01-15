import Base from '../../base';
import { ToolsPluginTypeEnum } from '..';
import { ToolsEventConstant } from '../../../core/plugins/base/event';

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
  public backgroundColor!: string;

  constructor(_this: Base) {
    this.name = ToolsPluginTypeEnum.DarkMode;
    this._this = _this;
  }

  public color(name: colorType, needReverse: boolean = false) {
    const darkMode = this._this.sheet.darkMode;
    if (darkMode && !needReverse) {
      return darkColorSum[name] || '';
    }
    return lightColorSum[name] || '';
  }
}
