import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '.';

export interface OptionsType {
  value: string;
  label: string;
}

export default class OptionBase extends BaseTool {
  public options: OptionsType[];
  public value: string;
  public valueLabel: string;
  constructor(props: ToolsProps) {
    super(props);
    this.type = ToolTypeEnum.OPTION;
    this.options = [];
    this.value = '';
    this.valueLabel = '';
    this.width = 48;
  }
}
