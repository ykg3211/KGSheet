import Base from '../base';

export enum PluginTypeEnum {
	RightClickPlugin = 'RightClickPlugin',
}

export interface PluginType {
	_this: Base;
	remove?: () => void;
}

export default class Plugins {
	private _this: Base;
	private pluginsArr: Record<string, PluginType>;

	constructor(_this: Base) {
		this._this = _this;
		this.pluginsArr = {};
	}

	public deregister(name?: string) {
		if (name) {
			this.pluginsArr[name].remove?.();
		} else {
			Object.values(this.pluginsArr).forEach((plugin) => plugin.remove?.());
		}
	}

	public register(Plugin: any) {
		const newPlugin = new Plugin(this._this);
		const name = newPlugin.name;

		if (this.pluginsArr[name]) {
			this.pluginsArr[name].remove?.();
		}

		this.pluginsArr[name] = newPlugin;
		// @ts-ignore
		this._this[name] = newPlugin;
	}
}
