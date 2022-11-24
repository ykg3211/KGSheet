import { ToolsEnum, ToolsIconsMap } from '..';
import { ToolsProps } from '../../interface';
import { BaseTool } from '../base';

export class DarkMode extends BaseTool {
  public darkMode: boolean;
  constructor(props: ToolsProps) {
    super(props);
    this.darkMode = false;
    this.label = '黑暗模式';
    this.toolTip = '切换黑暗/白天模式';
    this.icon = ToolsIconsMap[ToolsEnum.DARK_MODE];
  }

  public click() {
    this.sheet.toggleDarkMode();
  }
}
