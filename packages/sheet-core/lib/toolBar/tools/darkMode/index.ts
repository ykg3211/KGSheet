import { ToolsPluginTypeEnum } from '../../plugins';
import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';

export class DarkMode extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);

    const dark = this.sheet.darkMode;

    this.toolTip = '切换黑暗/白天模式';
    this.label = dark ? '黑暗模式' : '白天模式';
    this.icon = dark ? 'sheet-iconnightmode' : 'sheet-iconDaytimemode';
  }

  public click() {
    this.sheet.toggleDarkMode();
    const darkMode = this.sheet.darkMode;
    this.label = darkMode ? '黑暗模式' : '白天模式';
    this.icon = darkMode ? 'sheet-iconnightmode' : 'sheet-iconDaytimemode';
  }
}
