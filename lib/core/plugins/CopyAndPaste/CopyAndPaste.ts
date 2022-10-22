import { PluginTypeEnum } from "..";
import Base, { BaseDataType } from "../../base/base";
import KeyBoardPlugin from "../KeyBoardPlugin";
import { BASE_KEYS_ENUM, OPERATE_KEYS_ENUM } from "../KeyBoardPlugin/constant";
import SelectPowerPlugin from "../SelectAndInput/SelectPowerPlugin";

export default class CopyAndPaste {
  public name: string;
  private _this: Base;
  private KeyBoardPlugin: KeyBoardPlugin;
  private SelectPlugin: SelectPowerPlugin;
  constructor(_this: Base) {
    this.name = PluginTypeEnum.CopyAndPaste;
    this._this = _this;
    this.initPlugin();
  }
  private initPlugin() {
    if (this._this[PluginTypeEnum.SelectPowerPlugin]) {
      this.SelectPlugin = this._this[PluginTypeEnum.SelectPowerPlugin]
    } else {
      console.error('CommonInputPlugin 依赖于 SelectPowerPlugin, 请正确注册插件!');
      return;
    }
    if (this._this[PluginTypeEnum.KeyBoardPlugin]) {
      this.KeyBoardPlugin = this._this[PluginTypeEnum.KeyBoardPlugin]
    } else {
      console.error('CommonInputPlugin 依赖于 KeyboardPlugin, 请正确注册插件!');
      return;
    }

    this.initCopy();
  }

  private initCopy() {
    const copy = () => {
      const border = this.SelectPlugin.calcBorder();
      if (border) {
        const data = this._this.getDataByScope({
          leftTopCell: border.cellScope.startCell,
          rightBottomCell: border.cellScope.endCell
        })
        this.copy(data);
      }
    }

    this.KeyBoardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Meta],
      mainKeys: [OPERATE_KEYS_ENUM.c],
      callback: [() => {
        copy();
      }]
    })
  }

  public copy(data: BaseDataType) {
    try {
      const newClipboardItem = new ClipboardItem({
        data: JSON.stringify(data.data)
      })

      Object.keys(data.data.spanCells).forEach(key => {
        let [row, column] = key.split('_').map(Number);
        row -= data.scope.leftTopCell.row;
        column -= data.scope.leftTopCell.column;
        for (let r = row; r < row + data.data.spanCells[key].span[1]; r++) {
          for (let c = column; c < column + data.data.spanCells[key].span[0]; c++) {
            data.data.cells[r][c].content = '';
          }
        }
        data.data.cells[row][column].content = data.data.spanCells[key].content;
      })
      const textContent = data.data.cells.map(row => row.map(cell => cell.content).join('\t')).join('\n');
      navigator.clipboard.write([newClipboardItem]);
      navigator.clipboard.writeText(textContent);
    } catch (e) { }
  }
}