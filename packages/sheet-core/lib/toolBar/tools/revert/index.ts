import { BaseToolType, ToolsProps } from '../../interface';
import { BaseTool } from '../base';

export class Revert extends BaseTool {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '';
    this.icon = 'UndoOutlined';
  }

  public click() {
    console.log('Revert');
    this.sheet.reverse();
  }
}

export class AntiRevert extends BaseTool {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '';
    this.icon = 'RedoOutlined';
  }

  public click() {
    console.log('AntiRevert');
    this.sheet.anti_reverse();
  }
}
