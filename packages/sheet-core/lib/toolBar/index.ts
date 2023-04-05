import Excel from '../core';
import Base from './base';
import { config } from './interface';
import { ToolsPluginTypeEnum } from './plugins';
import { toolBarColorType } from './plugins/DarkMode';

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

  public getColor(name: toolBarColorType) {
    return this.getPlugin(ToolsPluginTypeEnum.DarkMode)?.color(name);
  }
}

export default ToolBar;
