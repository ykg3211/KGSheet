import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '.';

interface OptionsType {
  value: '';
  label: '';
}

export default class OptionBase extends BaseTool {
  public width: string; // 实际是min-width。计算宽度用的。两行的时候用
  public options: OptionsType[];
  public value: string;
  constructor(props: ToolsProps) {
    super(props);
    this.type = ToolTypeEnum.OPTION;
    this.options = [];
    this.value = '';
    this.width = '48px';
  }
}
