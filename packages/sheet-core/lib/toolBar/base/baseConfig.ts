import { BarSettingType } from '../interface';
import { ToolsEnum } from '../tools';

const baseToolBarConfig: BarSettingType = [
  {
    lines: 1,
    iconWidth: 24,
    tools: [ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT, ToolsEnum.DARK_MODE],
  },
  // {
  //   lines: 1,
  //   iconWidth: 24,
  //   tools: [ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT],
  // },
];

export default baseToolBarConfig;
