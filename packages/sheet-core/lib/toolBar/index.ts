import Excel from '../core';
import Base from './base';
import { config } from './interface';
import { ToolsPluginTypeEnum } from './plugins';
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
    return this.getPlugin(ToolsPluginTypeEnum.DarkMode)?.color(name);
  }
}

export default ToolBar;
