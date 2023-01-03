import { META_KEY } from '../../../utils';
import { ToolsProps } from '../../interface';
import ColorBase from '../base/colorBase';

export class BaseColor extends ColorBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '撤销';
    this.toolTip = `撤销(${META_KEY}+z)`;
    this.icon = 'sheet-iconcancel';
  }

  public click() {
    console.log('Revert');
    this.sheet.reverse();
  }
}
