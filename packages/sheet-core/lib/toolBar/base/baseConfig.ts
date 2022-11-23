import { BarSettingType, ToolsEnum } from '../interface';

const baseToolBarConfig: BarSettingType = [
  {
    lines: 1,
    iconWidth: 24,
    tools: [ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT],
  },
  // {
  //   lines: 1,
  //   iconWidth: 24,
  //   tools: [ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT],
  // },
];

export default baseToolBarConfig;
