import Excel from '../core';
import Base from './base';
import { config } from './interface';
import { ToolsPluginTypeEnum } from './plugins';
import { colorType } from './plugins/DarkMode';

interface ToolBarType {
  sheet: Excel;
  config?: config;
}

class BottomBar extends Base {
  constructor({ sheet, config }: ToolBarType) {
    super(sheet, config);
    sheet.BottomBar = this;
  }

  public getTools() {
    return this.Tools;
  }

  public getColor(name: colorType) {
    return this.getPlugin(ToolsPluginTypeEnum.DarkMode)?.color(name);
  }
}

export default BottomBar;
