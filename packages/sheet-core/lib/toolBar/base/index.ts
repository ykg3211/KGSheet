import Excel from '../../core';
import BaseEvent from '../../core/plugins/base/event';
import { BarSettingType, config, ToolsEnum } from '../interface';
import getTools from '../tools';
import baseToolBarConfig from './baseConfig';

export default class Base extends BaseEvent {
	public sheet: Excel;
	protected Tools: any[];
	protected ToolsMap: Record<string, any>;
	private tag: number;
	constructor(sheet: Excel, config?: config) {
		super();
		this.sheet = sheet;

		this.tag = 0;
		this.Tools = [];
		this.ToolsMap = {};
		this.initTools(config?.barSetting || baseToolBarConfig);
	}

	private initTools(barSetting: BarSettingType) {
		this.Tools = barSetting.map(this.dispatchTools.bind(this));
	}

	private dispatchTools(type: string) {
		if (!this.ToolsMap[type]) {
			const Tool = getTools(type);
			if (!Tool) {
				return;
			}
			this.ToolsMap[type] = new Tool({
				sheet: this.sheet,
				toolBar: this,
				key: 'sid_' + type + '_' + this.tag++,
			});
		}

		return this.ToolsMap[type];
	}
}
