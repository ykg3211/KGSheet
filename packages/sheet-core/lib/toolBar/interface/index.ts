import Excel from '@/core';
import ToolBar from '..';
import Base from '../base';

export enum ToolsEnum {
	REVERT = 'revert',
	ANTI_REVERT = 'anti_revert',
}

export type BarSettingType = Array<string>;

export interface config {
	barSetting: BarSettingType;
}

export interface ToolsProps {
	sheet: Excel;
	toolBar: Base;
	key: string;
}

export interface BaseToolType {
	icon: string;
	key: string;
	class?: string;
	style?: CSSRule;
	click: () => void;
}
