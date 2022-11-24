import Excel from '../core';
import Base from './base';
import { config } from './interface';
import { PluginTypeEnum } from './plugins';
import { colorType } from './plugins/DarkMode.ts';

interface ToolBarType {
  sheet: Excel;
  config?: config;
}
class ToolBar extends Base {
  constructor({ sheet, config }: ToolBarType) {
    super(sheet, config);
    sheet.ToolBar = this;
  }

  public getTools() {
    return this.Tools;
  }

  public getColor(name: colorType) {
    return this.getPlugin(PluginTypeEnum.DarkMode)?.color(name);
  }
}

export default ToolBar;
