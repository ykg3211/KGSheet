import Excel from '../../core';
import Base from '../base';
import { BaseTool } from '../tools/base';
import { ToolsEnum } from '../tools';

export type BarSettingType = ToolsEnum[][];

export interface config {
  barSetting?: BarSettingType;
}

export interface ToolsProps {
  sheet: Excel;
  toolBar: Base;
  key: string;
}

export interface ToolType<T = BaseTool> {
  key: string;
  tool: T;
}
