import { ToolsPluginTypeEnum } from '../../plugins';
import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';

export class DarkMode extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);

    const dark = this.toolBar.getPlugin(ToolsPluginTypeEnum.DarkMode)?.darkMode;

    this.toolTip = '切换黑暗/白天模式';
    this.label = dark ? '黑暗模式' : '白天模式';
    this.icon = dark ? 'sheet-iconnightmode' : 'sheet-iconDaytimemode';
  }

  public click() {
    const darkMode = this.toolBar.getPlugin(ToolsPluginTypeEnum.DarkMode)?.toogleDarkMode();
    this.label = darkMode ? '黑暗模式' : '白天模式';
    this.icon = darkMode ? 'sheet-iconnightmode' : 'sheet-iconDaytimemode';
  }
}
