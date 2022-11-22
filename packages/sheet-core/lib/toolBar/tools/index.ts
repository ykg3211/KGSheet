import { ToolsEnum } from '../interface';
import { AntiRevert, Revert } from './revert';

const ToolsMap: Record<string, any> = {
  [ToolsEnum.REVERT]: Revert,
  [ToolsEnum.ANTI_REVERT]: AntiRevert,
};

export default function getTools(name: string) {
  return ToolsMap[name] || Revert;
}
