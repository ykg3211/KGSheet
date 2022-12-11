import { BarSettingType } from '../interface';
import { ToolsEnum } from '../tools';

const baseToolBarConfig: BarSettingType = [
  {
    tools: [[ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT, ToolsEnum.CLEAR_STYLE]],
  },
  {
    tools: [
      [ToolsEnum.FONT_SIZE, ToolsEnum.DARK_MODE],
      [ToolsEnum.FONT_WEIGHT, ToolsEnum.FONT_DELETE_LINE, ToolsEnum.FONT_ITALIC, ToolsEnum.FONT_UNDER_LINE],
    ],
  },
  {
    tools: [
      [ToolsEnum.COMBINE_CELLS],
      [ToolsEnum.TEXT_ALIGN_LEFT, ToolsEnum.TEXT_ALIGN_CENTER, ToolsEnum.TEXT_ALIGN_RIGHT],
    ],
  },
];

export default baseToolBarConfig;
