import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '.';

interface OptionsType {
  value: '';
  label: '';
}

export default class OptionBase extends BaseTool {
  public options: OptionsType[];
  public value: string;
  constructor(props: ToolsProps) {
    super(props);
    this.type = ToolTypeEnum.OPTION;
    this.options = [];
    this.value = '';
    this.width = 48;
  }
}
