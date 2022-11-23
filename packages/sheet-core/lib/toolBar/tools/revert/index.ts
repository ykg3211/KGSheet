import { BaseToolType, ToolsEnum, ToolsIconsMap, ToolsProps } from '../../interface';
import { BaseTool } from '../base';

export class Revert extends BaseTool {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '撤销';
    this.icon = ToolsIconsMap[ToolsEnum.REVERT];
  }

  public click() {
    console.log('Revert');
    this.sheet.reverse();
  }
}

export class AntiRevert extends BaseTool {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '重做';
    this.icon = ToolsIconsMap[ToolsEnum.ANTI_REVERT];
  }

  public click() {
    console.log('AntiRevert');
    this.sheet.anti_reverse();
  }
}
