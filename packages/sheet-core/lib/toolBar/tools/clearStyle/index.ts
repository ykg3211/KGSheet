import { PluginTypeEnum } from '../../../core/plugins';
import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';

export class ClearStyle extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '清除格式';
    this.toolTip = '清除格式';
    this.icon = 'sheet-iconerase';
  }

  public click() {
    this.sheet.clearStyle();
  }
}
