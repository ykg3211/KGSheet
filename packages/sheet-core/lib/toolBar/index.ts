import Excel from '../core';
import Base from './base';
import { config } from './interface';

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
}

export default ToolBar;
