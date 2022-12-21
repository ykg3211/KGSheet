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

  public set _active(v: boolean) {
    this.label = v ? '解除合并单元格' : '合并单元格';
    this.toolTip = v ? '解除合并单元格' : '合并单元格';
    this.active = v;
  }
}
