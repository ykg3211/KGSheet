import { ClearStyle } from './clearStyle';
import { DarkMode } from './darkMode';
import { FontDeleteLine, FontItalic, FontSize, FontUnderLine, FontWeight } from './fontStyle';
import { AntiRevert, Revert } from './revert';
import { CombineCells } from './combineCells';
import { TextAlignLeft, TextAlignCenter, TextAlignRight } from './textAlign';
import { FontColor, BackgroundColor } from './color';

export enum ToolsEnum {
  REVERT = 'revert', // 撤销
  ANTI_REVERT = 'anti_revert', // 反撤销
  FONT_SIZE = 'font_size', // 文本字体大小
  DARK_MODE = 'dark_mode', // 黑夜模式切换
  CLEAR_STYLE = 'clear_style', // 清除样式
  FONT_WEIGHT = 'font_weight', // 字体粗细
  FONT_DELETE_LINE = 'font_delete_line', // 删除线
  FONT_ITALIC = 'font_italic', // 斜体
  FONT_UNDER_LINE = 'font_under_line', // 下划线
  COMBINE_CELLS = 'combine_cells', // 合并单元格
  TEXT_ALIGN_LEFT = 'text_align_left', // 文字左对齐
  TEXT_ALIGN_CENTER = 'text_align_center', // 文字居中
  TEXT_ALIGN_RIGHT = 'text_align_right', // 文字右对齐
  FONT_COLOR = 'font_color', // 子体颜色
  BACKGROUND_COLOR = 'background_color', // 背景颜色
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
  [ToolsEnum.FONT_COLOR]: FontColor;
  [ToolsEnum.BACKGROUND_COLOR]: BackgroundColor;
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
  [ToolsEnum.FONT_COLOR]: FontColor,
  [ToolsEnum.BACKGROUND_COLOR]: BackgroundColor,
};

export default function getTools(name: ToolsEnum) {
  return ToolsMap[name] || Revert;
}
