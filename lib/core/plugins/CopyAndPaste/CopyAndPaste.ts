import { PluginTypeEnum } from "..";
import Base, { BaseDataType } from "../../base/base";
import { RenderZIndex } from "../../base/constant";
import { EventConstant } from "../base/event";
import KeyBoardPlugin from "../KeyBoardPlugin";
import { BASE_KEYS_ENUM, OPERATE_KEYS_ENUM } from "../KeyBoardPlugin/constant";
import SelectPowerPlugin, { borderType } from "../SelectAndInput/SelectPowerPlugin";

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


    this.KeyBoardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Meta],
      mainKeys: [OPERATE_KEYS_ENUM.v],
      callback: [() => {
        this.paste();
      }]
    })
  }

  // "text/plain"
  // 1
  // : 
  // "text/html"
  // 2
  // : 
  // "image/png"
  public async paste() {
    const ClipboardItems = await navigator.clipboard.read();
    const blob = await ClipboardItems[0].getType('text/html');
    const text = await blob.text();
    console.log(text)
  }

  public copy(data: BaseDataType) {
    try {
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


      const type = "text/plain";
      const blob = new Blob([JSON.stringify(data)], { type });
      const _data = [new ClipboardItem({ [type]: blob })];
      navigator.clipboard.write(_data);
      navigator.clipboard.writeText(textContent);
      this.registeOnceDashBorder(data);
    } catch (e) { }
  }

  private registeOnceDashBorder(data: BaseDataType) {
    this._this.resetRenderFunction(RenderZIndex.COPY_SELLS_BORDER)
    this._this.addRenderFunction(RenderZIndex.COPY_SELLS_BORDER, [((ctx) => {
      ctx.save();
      const [x, y, w, h] = this._this.calBorder(data.scope.leftTopCell, data.scope.rightBottomCell);
      this._this._data.h
      ctx.strokeStyle = '#4a89fe'
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.setLineDash([5]);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }).bind(this)])
    this._this._render();
    this._this.once(EventConstant.EXCEL_CHANGE, () => {
      this._this.resetRenderFunction(RenderZIndex.COPY_SELLS_BORDER)
    })
  }
}