import { ToolsProps } from '../../interface';
import OptionBase from '../base/optionBase';

export class FontSize extends OptionBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '字号';
    this.toolTip = '字号';
    this.options = [9, 10, 11, 12, 14, 18, 24, 30, 36].map((num) => ({
      label: num + '',
      value: num + '',
    }));
    this.value = '12';
    this.width = 62;
  }

  public click() {
    //
  }
}
