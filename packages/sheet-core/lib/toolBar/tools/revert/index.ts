import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';

export class Revert extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '撤销';
    this.toolTip = '撤销(⌘+z)';
    this.icon = 'sheet-iconcancel';
  }

  public click() {
    console.log('Revert');
    this.sheet.reverse();
  }
}

export class AntiRevert extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '重做';
    this.toolTip = '重做(⌘+shift+z)';
    this.icon = 'sheet-iconredo';
  }

  public click() {
    console.log('AntiRevert');
    this.sheet.anti_reverse();
  }
}
