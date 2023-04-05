import Excel from '../../core';
import Base from '../base';
import { BaseTool } from '../tools/base';
import { ToolsEnum } from '../tools';

export type BarSettingType = Array<ToolsGroupConfig<ToolsEnum>>;

export interface config {
  barSetting?: BarSettingType;
  shadowInput?: boolean;
}

export interface ToolsProps {
  sheet: Excel;
  toolBar: Base;
  key: string;
}

export interface ToolsGroupConfig<T = BaseTool> {
  tools: T[][];
}

export interface ToolsGroupType extends ToolsGroupConfig {
  key: string;
}
