import { BarSettingType } from '../interface';
import { ToolsEnum } from '../tools';

const baseToolBarConfig: BarSettingType = [
  {
    lines: 1,
    tools: [[ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT, ToolsEnum.CLEAR_STYLE]],
  },
  {
    lines: 2,
    tools: [
      [ToolsEnum.FONT_SIZE, ToolsEnum.DARK_MODE],
      [ToolsEnum.FONT_WEIGHT, ToolsEnum.FONT_DELETE_LINE, ToolsEnum.FONT_ITALIC, ToolsEnum.FONT_UNDER_LINE],
    ],
  },
  {
    lines: 1,
    tools: [[ToolsEnum.COMBINE_CELLS]],
  },
];

export default baseToolBarConfig;
