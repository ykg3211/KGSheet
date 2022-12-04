import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';

export class CombineCells extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '合并单元格';
    this.toolTip = '合并单元格';
    this.icon = 'sheet-iconmerge';
  }

  public click() {
    this.sheet.combineCells();
  }
}
