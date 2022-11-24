import { DarkMode } from './darkMode';
import { AntiRevert, Revert } from './revert';

export enum ToolsEnum {
  REVERT = 'revert',
  ANTI_REVERT = 'anti_revert',
  DARK_MODE = 'dark_mode',
}

export const ToolsIconsMap = {
  [ToolsEnum.REVERT]: 'sheet-iconcancel',
  [ToolsEnum.ANTI_REVERT]: 'sheet-iconredo',
  [ToolsEnum.DARK_MODE]: 'sheet-iconcentre',
};

const ToolsMap: Record<string, any> = {
  [ToolsEnum.REVERT]: Revert,
  [ToolsEnum.ANTI_REVERT]: AntiRevert,
  [ToolsEnum.DARK_MODE]: DarkMode,
};

export default function getTools(name: string) {
  return ToolsMap[name] || Revert;
}
