import { ClearStyle } from './clearStyle';
import { DarkMode } from './darkMode';
import { FontSize } from './fontSize';
import { AntiRevert, Revert } from './revert';

export enum ToolsEnum {
  REVERT = 'revert',
  ANTI_REVERT = 'anti_revert',
  FONT_SIZE = 'font_size',
  DARK_MODE = 'dark_mode',
  CLEAR_STYLE = 'clear_style',
}

const ToolsMap: Record<string, any> = {
  [ToolsEnum.REVERT]: Revert,
  [ToolsEnum.ANTI_REVERT]: AntiRevert,
  [ToolsEnum.FONT_SIZE]: FontSize,
  [ToolsEnum.DARK_MODE]: DarkMode,
  [ToolsEnum.CLEAR_STYLE]: ClearStyle,
};

export default function getTools(name: string) {
  return ToolsMap[name] || Revert;
}
