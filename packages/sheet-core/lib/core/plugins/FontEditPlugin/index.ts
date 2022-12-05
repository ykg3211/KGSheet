import Base from '../../base/base';
import { deepClone, handleCell } from '../../../utils';
import { PluginTypeEnum } from '..';
import KeyboardPlugin from '../KeyboardPlugin';
import { BASE_KEYS_ENUM, META, OPERATE_KEYS_ENUM } from '../KeyboardPlugin/constant';
import SelectPowerPlugin from '../SelectAndInput/SelectPowerPlugin';
import { Cell, CellStyle, ExcelConfig, SpanCell, TextDecoration } from '../../../interfaces';
import { CellCornerScopeType } from '../SelectAndInput/EditCellPlugin';

// 主要用于计算style
const INIT_V = 'init_v'; // 初始态
const NOT_SAME = 'not_same'; // 一堆cell的属性不同的标志

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

  public getSameAttributes(data: ExcelConfig, scope: CellCornerScopeType) {
    const needAttrs: Array<keyof CellStyle> = [
      'textAlign',
      'backgroundColor',
      'textDecoration',
      'fontWeight',
      'fontColor',
      'fontSize',
      'font',
    ];

    // @ts-ignore
    const attributes: Record<keyof CellStyle, any> = {};
    needAttrs.forEach((key) => {
      attributes[key] = INIT_V;
    });

    const skipMap: Record<string, boolean> = {};

    const commonHandleCell = (cell: Cell | SpanCell) => {
      needAttrs.forEach((attr) => {
        if (attributes[attr] === INIT_V) {
          attributes[attr] = cell.style[attr];
        } else if (attributes[attr] !== cell.style[attr]) {
          attributes[attr] = NOT_SAME;
        }
      });
    };

    Object.keys(data.spanCells).forEach((key) => {
      const spanCell = data.spanCells[key];
      const [w, h] = spanCell.span;
      const [row, column] = key.split('_').map(Number);

      for (let i = 0; i < h; i++) {
        for (let ii = 0; ii < w; ii++) {
          const key = `${row - scope.leftTopCell.row + i}_${column - scope.leftTopCell.column + ii}`;
          skipMap[key] = true;
        }
      }

      commonHandleCell(spanCell);
    });

    data.cells.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!skipMap[r + '_' + c]) {
          commonHandleCell(cell);
        }
      });
    });

    return attributes;
  }

  private initEvent() {
    this.KeyboardPlugin.register({
      baseKeys: [META],
      mainKeys: OPERATE_KEYS_ENUM.b,
      callbacks: [
        (e) => {
          e.preventDefault();
          this.blod();
        },
      ],
    });

    this.KeyboardPlugin.register({
      baseKeys: [META],
      mainKeys: OPERATE_KEYS_ENUM.u,
      callbacks: [
        (e) => {
          e.preventDefault();
          this.underLine();
        },
      ],
    });
  }

  public blod() {
    this._this.devMode && console.log('Meta + b');
    const scope = this.SelectPowerPlugin.getSelectCellsScope();
    if (!scope) {
      return;
    }
    const { data: sourceData } = this._this.getDataByScope(scope);

    const preAttributes = this.getSameAttributes(sourceData, scope);

    let newWeight = '800';
    if (preAttributes.fontWeight === '800') {
      newWeight = 'normal';
    }

    const targetData = handleCell(sourceData, (cell) => {
      cell.style.fontWeight = newWeight;
      return cell;
    });

    this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.cellsChange({
      scope,
      pre_data: sourceData,
      after_data: targetData,
    });
  }

  public deleteLine() {
    const scope = this.SelectPowerPlugin.getSelectCellsScope();
    if (!scope) {
      return;
    }
    const { data: sourceData } = this._this.getDataByScope(scope);

    const preAttributes = this.getSameAttributes(sourceData, scope);

    let textDecoration: TextDecoration = 'line-through';
    if (preAttributes.textDecoration === 'line-through') {
      textDecoration = 'none';
    }

    const targetData = handleCell(sourceData, (cell) => {
      cell.style.textDecoration = textDecoration;
      return cell;
    });

    this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.cellsChange({
      scope,
      pre_data: sourceData,
      after_data: targetData,
    });
  }

  public underLine() {
    this._this.devMode && console.log('Meta + u');
    const scope = this.SelectPowerPlugin.getSelectCellsScope();
    if (!scope) {
      return;
    }
    const { data: sourceData } = this._this.getDataByScope(scope);

    const preAttributes = this.getSameAttributes(sourceData, scope);

    let textDecoration: TextDecoration = 'underline';
    if (preAttributes.textDecoration === 'underline') {
      textDecoration = 'none';
    }

    const targetData = handleCell(sourceData, (cell) => {
      cell.style.textDecoration = textDecoration;
      return cell;
    });

    this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.cellsChange({
      scope,
      pre_data: sourceData,
      after_data: targetData,
    });
  }
}
