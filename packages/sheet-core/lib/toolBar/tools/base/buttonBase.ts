import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '.';

export default class ButtonBase extends BaseTool {
  constructor(props: ToolsProps) {
    super(props);
    this.width = 34;
    this.type = ToolTypeEnum.BUTTON;
  }
}
