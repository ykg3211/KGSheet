import { ClearStyle } from './clearStyle';
import { DarkMode } from './darkMode';
import { FontDeleteLine, FontItalic, FontSize, FontUnderLine, FontWeight } from './fontStyle';
import { AntiRevert, Revert } from './revert';
import { CombineCells } from './combineCells';
import { TextAlignLeft, TextAlignCenter, TextAlignRight } from './textAlign';

export enum ToolsEnum {
  REVERT = 'revert',
  ANTI_REVERT = 'anti_revert',
  FONT_SIZE = 'font_size',
  DARK_MODE = 'dark_mode',
  CLEAR_STYLE = 'clear_style',
  FONT_WEIGHT = 'font_weight',
  FONT_DELETE_LINE = 'font_delete_line',
  FONT_ITALIC = 'font_italic',
  FONT_UNDER_LINE = 'font_under_line',
  COMBINE_CELLS = 'combine_cells',
  TEXT_ALIGN_LEFT = 'text_align_left',
  TEXT_ALIGN_CENTER = 'text_align_center',
  TEXT_ALIGN_RIGHT = 'text_align_right',
}

export interface ToolsMapType {
  [ToolsEnum.REVERT]: Revert;
  [ToolsEnum.ANTI_REVERT]: AntiRevert;
  [ToolsEnum.FONT_SIZE]: FontSize;
  [ToolsEnum.DARK_MODE]: DarkMode;
  [ToolsEnum.CLEAR_STYLE]: ClearStyle;
  [ToolsEnum.FONT_WEIGHT]: FontWeight;
  [ToolsEnum.FONT_DELETE_LINE]: FontDeleteLine;
  [ToolsEnum.FONT_ITALIC]: FontItalic;
  [ToolsEnum.FONT_UNDER_LINE]: FontUnderLine;
  [ToolsEnum.COMBINE_CELLS]: CombineCells;
  [ToolsEnum.TEXT_ALIGN_LEFT]: TextAlignLeft;
  [ToolsEnum.TEXT_ALIGN_CENTER]: TextAlignCenter;
  [ToolsEnum.TEXT_ALIGN_RIGHT]: TextAlignRight;
}

const ToolsMap = {
  [ToolsEnum.REVERT]: Revert,
  [ToolsEnum.ANTI_REVERT]: AntiRevert,
  [ToolsEnum.FONT_SIZE]: FontSize,
  [ToolsEnum.DARK_MODE]: DarkMode,
  [ToolsEnum.CLEAR_STYLE]: ClearStyle,
  [ToolsEnum.FONT_WEIGHT]: FontWeight,
  [ToolsEnum.FONT_DELETE_LINE]: FontDeleteLine,
  [ToolsEnum.FONT_ITALIC]: FontItalic,
  [ToolsEnum.FONT_UNDER_LINE]: FontUnderLine,
  [ToolsEnum.COMBINE_CELLS]: CombineCells,
  [ToolsEnum.TEXT_ALIGN_LEFT]: TextAlignLeft,
  [ToolsEnum.TEXT_ALIGN_CENTER]: TextAlignCenter,
  [ToolsEnum.TEXT_ALIGN_RIGHT]: TextAlignRight,
};

export default function getTools(name: ToolsEnum) {
  return ToolsMap[name] || Revert;
}
