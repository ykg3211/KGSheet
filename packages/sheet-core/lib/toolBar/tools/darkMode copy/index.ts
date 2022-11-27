import { ToolsPluginTypeEnum } from '../../plugins';
import { ToolsProps } from '../../interface';
import { BaseTool } from '../base';

export class DarkMode extends BaseTool {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '黑暗模式';
    this.toolTip = '切换黑暗/白天模式';
    this.icon = 'sheet-iconcentre';
  }

  public click() {
    const darkMode = this.toolBar.getPlugin(ToolsPluginTypeEnum.DarkMode)?.toogleDarkMode();
    this.label = darkMode ? '黑暗模式' : '白天模式';
  }
}
