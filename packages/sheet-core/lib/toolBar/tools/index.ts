import { ToolsEnum } from '../interface';
import { AntiRevert, Revert } from './revert';

export default function getTools(name: string) {
  let tool = null;
  switch (name) {
    case ToolsEnum.REVERT:
      tool = Revert;
      break;
    case ToolsEnum.ANTI_REVERT:
      tool = AntiRevert;
      break;
    default:
      break;
  }
  return tool;
}

// export class demo implements BaseToolType {
// 	private sheet: ToolsProps['sheet'];
// 	private toolBar: ToolsProps['toolBar'];

// 	constructor({ sheet, toolBar }: ToolsProps) {
// 		this.sheet = sheet;
// 		this.toolBar = toolBar;
// 	}

// 	public click() {}
// }
