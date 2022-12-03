import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '.';

export default class ButtonBase extends BaseTool {
  public isActive: boolean; // 可以不管他， 是用来存储是不是被触发的， 用于一些样式按钮。

  constructor(props: ToolsProps) {
    super(props);
    this.width = 34;
    this.type = ToolTypeEnum.BUTTON;
    this.isActive = false;
  }
}
