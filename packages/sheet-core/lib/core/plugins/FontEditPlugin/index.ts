import Base from '../../base/base';
import { deepClone, handleCell } from '../../../utils';
import { PluginTypeEnum } from '..';
import KeyboardPlugin from '../KeyboardPlugin';
import { BASE_KEYS_ENUM, OPERATE_KEYS_ENUM } from '../KeyboardPlugin/constant';
import SelectPowerPlugin from '../SelectAndInput/SelectPowerPlugin';

export default class FontEditPlugin {
  private _this: Base;
  public name: string;
  private KeyboardPlugin!: KeyboardPlugin;
  private SelectPowerPlugin!: SelectPowerPlugin;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.FontEditPlugin;
    this._this = _this;

    this.register();
    this.initEvent();
  }

  private register() {
    const KeyboardPlugin = this._this.getPlugin(PluginTypeEnum.KeyboardPlugin);
    if (KeyboardPlugin) {
      this.KeyboardPlugin = KeyboardPlugin;
    }

    const SelectPowerPlugin = this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin);
    if (SelectPowerPlugin) {
      this.SelectPowerPlugin = SelectPowerPlugin;
    }
  }

  private initEvent() {
    this.b();
  }

  private b() {
    const cb = () => {
      //
      const scope = this.SelectPowerPlugin.getSelectCellsScope();
      if (!scope) {
        return;
      }
      const sourceData = this._this.getDataByScope(scope).data;
      const targetData = handleCell(sourceData, (cell) => {
        cell.style.fontWeight = 'blod';
        return cell;
      });
    };

    this.KeyboardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Meta],
      mainKeys: OPERATE_KEYS_ENUM.b,
      callbacks: [
        (e) => {
          e.preventDefault();
          cb();
        },
      ],
    });
  }

  private u() {
    const cb = () => {
      //
    };

    this.KeyboardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Meta],
      mainKeys: OPERATE_KEYS_ENUM.b,
      callbacks: [
        (e) => {
          e.preventDefault();
          cb();
        },
      ],
    });
  }
}
