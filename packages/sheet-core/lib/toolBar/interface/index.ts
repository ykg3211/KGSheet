import Excel from '../../core';
import ToolBar from '..';
import Base from '../base';

export enum ToolsEnum {
  REVERT = 'revert',
  ANTI_REVERT = 'anti_revert',
}

export const ToolsIconsMap = {
  [ToolsEnum.REVERT]: 'sheet-iconcancel',
  [ToolsEnum.ANTI_REVERT]: 'sheet-iconredo',
};

export type BarSettingType = Array<ToolsGroupConfig<ToolsEnum>>;

export interface config {
  barSetting: BarSettingType;
}

export interface ToolsProps {
  sheet: Excel;
  toolBar: Base;
  key: string;
}

export interface ToolsGroupConfig<T = BaseToolType> {
  lines: number;
  iconWidth: number;
  tools: T[];
}

export interface ToolsGroupType<T = BaseToolType> {
  key: string;
  lines: number;
  iconWidth: number;
  tools: T[];
}

export interface BaseToolType {
  icon: string;
  label: string;
  key: string;
  class?: string;
  style?: CSSRule;
  click: () => void;
}
