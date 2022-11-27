import { ToolsProps } from '../../interface';
import OptionBase from '../base/optionBase';

export class FontSize extends OptionBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '字号';
    this.toolTip = '字号';
    this.icon = 'sheet-iconcentre';
  }

  public click() {
    //
  }
}
