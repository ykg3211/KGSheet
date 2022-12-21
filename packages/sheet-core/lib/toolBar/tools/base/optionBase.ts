import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '.';

export interface OptionsType {
  value: string;
  label: string;
}

export default class OptionBase extends BaseTool {
  public options: OptionsType[];
  public _value: string;
  public valueLabel: string;
  constructor(props: ToolsProps) {
    super(props);
    this.type = ToolTypeEnum.OPTION;
    this.options = [];
    this._value = '';
    this.valueLabel = '';
  }

  public get value() {
    return this._value;
  }

  public set value(v: string) {
    this._value = v;
    this.valueLabel = this.options.find((option) => option.value === v)?.label || v;
  }
}
