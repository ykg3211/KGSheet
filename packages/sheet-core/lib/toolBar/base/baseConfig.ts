import { BarSettingType } from '../interface';
import { ToolsEnum } from '../tools';

const baseToolBarConfig: BarSettingType = [
  {
    lines: 1,
    tools: [ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT, ToolsEnum.CLEAR_STYLE],
  },
  {
    lines: 2,
    tools: [ToolsEnum.FONT_SIZE, ToolsEnum.DARK_MODE],
  },
  // {
  //   lines: 1,
  //   tools: [ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT, ToolsEnum.DARK_MODE],
  // },
];

export default baseToolBarConfig;
