import { createDefaultStyle } from '../../../utils/defaultData';
import { PluginTypeEnum } from '..';
import { deepClone } from '../../../utils';
import { html2excel } from '../../../utils/htmlParse';
import Base, { BaseDataType } from '../../base/base';
import { RenderZIndex } from '../../base/constant';
import { BusinessEventConstant, EventConstant } from '../base/event';
import ExcelBaseFunction from '../EventStack';
import KeyboardPlugin from '../KeyboardPlugin';
import { META, OPERATE_KEYS_ENUM } from '../KeyboardPlugin/constant';
import SelectPowerPlugin from '../SelectAndInput/SelectPowerPlugin';

/**
 * Chrome 浏览器规定，只有 HTTPS 协议的页面才能使用这个 API。
 * 所以在http的页面这个功能是烂掉的，
 */

export default class CopyAndPaste {
  public name: string;
  private _this: Base;
  private KeyboardPlugin!: KeyboardPlugin;
  private SelectPlugin!: SelectPowerPlugin;
  private ExcelBaseFunction!: ExcelBaseFunction;
  constructor(_this: Base) {
    this.name = PluginTypeEnum.CopyAndPaste;
    this._this = _this;
    this.initPlugin();
  }
  private initPlugin() {
    const SelectPowerPlugin = this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin);
    if (SelectPowerPlugin) {
      this.SelectPlugin = SelectPowerPlugin;
    } else {
      console.error('CommonInputPlugin 依赖于 SelectPowerPlugin, 请正确注册插件!');
      return;
    }

    const KeyboardPlugin = this._this.getPlugin(PluginTypeEnum.KeyboardPlugin);
    if (KeyboardPlugin) {
      this.KeyboardPlugin = KeyboardPlugin;
    } else {
      console.error('CommonInputPlugin 依赖于 KeyboardPlugin, 请正确注册插件!');
      return;
    }

    const ExcelBaseFunction = this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction);
    if (ExcelBaseFunction) {
      this.ExcelBaseFunction = ExcelBaseFunction;
    } else {
      console.error('CommonInputPlugin 依赖于 KeyboardPlugin, 请正确注册插件!');
      return;
    }

    this.initCopy();
  }

  private initCopy() {
    const copy = () => {
      this._this.devMode && console.log('copy');
      const border = this.SelectPlugin.getSelectCellsScope();
      console.log(border);
      if (border) {
        const data = this._this.getDataByScope({
          leftTopCell: border.leftTopCell,
          rightBottomCell: border.rightBottomCell,
        });
        this.copy(data);
      }
    };

    this.KeyboardPlugin.register({
      baseKeys: [META],
      mainKeys: [OPERATE_KEYS_ENUM.c],
      callbacks: [
        () => {
          copy();
        },
      ],
    });

    this.KeyboardPlugin.register({
      baseKeys: [META],
      mainKeys: [OPERATE_KEYS_ENUM.v],
      callbacks: [
        () => {
          this.paste();
        },
      ],
    });
  }

  // "text/plain"
  // "text/html"
  // "image/png"
  public async paste() {
    if (!navigator.clipboard) {
      this._this.emit(BusinessEventConstant.MSG_BOX, {
        type: 'warning',
        message: 'HTTP协议不支持复制粘贴！',
      });
      return;
    }

    this._this.devMode && console.log('paste');
    let ClipboardItems;
    try {
      ClipboardItems = await navigator.clipboard.read();
    } catch (e) {}

    try {
      // @ts-ignore
      const blob_html = await ClipboardItems[0].getType('text/html');
      const text_html = await blob_html.text();
      console.log(html2excel(text_html));
      const newExcelData = html2excel(text_html);
      if (newExcelData?.cells) {
        newExcelData.cells = newExcelData?.cells.map((cells) => {
          return cells.map((cell) => {
            cell.style = {
              ...createDefaultStyle(),
              ...cell.style,
            };
            return cell;
          });
        });
      }
      const selectCell = this.SelectPlugin.selectCell;
      if (!newExcelData || !selectCell) {
        return;
      }
      const _h = newExcelData?.cells.length;
      const _w = newExcelData?.cells[0].length;
      const preData = this._this.getDataByScope({
        leftTopCell: selectCell,
        rightBottomCell: {
          row: (selectCell?.row || 0) + _h - 1,
          column: (selectCell?.column || 0) + _w - 1,
        },
      });
      console.log({
        scope: {
          leftTopCell: selectCell,
          rightBottomCell: {
            row: (selectCell?.row || 0) + _h,
            column: (selectCell?.column || 0) + _w,
          },
        },
        pre_data: preData.data,
        after_data: {
          ...preData.data,
          cells: deepClone(newExcelData.cells),
        },
      });
      this.ExcelBaseFunction.cellsChange({
        scope: {
          leftTopCell: selectCell,
          rightBottomCell: {
            row: (selectCell?.row || 0) + _h - 1,
            column: (selectCell?.column || 0) + _w - 1,
          },
        },
        pre_data: preData.data,
        after_data: {
          ...preData.data,
          cells: deepClone(newExcelData.cells),
        },
      });
      return;
    } catch (e) {}

    try {
      // @ts-ignore
      const blob_plain = await ClipboardItems[0].getType('text/plain');
      const text_plain = await blob_plain.text();
      const content = text_plain.split('\n').map((item) => item.split('\t'));
      this._this.devMode && console.log('paste');
      this._this.devMode && console.log(content);
      const anchor = this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin)?.selectCell;
      if (anchor) {
        this._this.getPlugin(PluginTypeEnum.EditCellPlugin)?.setContent(content, anchor);
      }
      return;
    } catch (e) {}

    try {
      // @ts-ignore
      const blob_png = await ClipboardItems[0].getType('text/png');
      const text_png = await blob_png.text();
      // console.log('png', text_png)
    } catch (e) {}
  }

  public copy(data: BaseDataType) {
    if (!navigator.clipboard) {
      this._this.emit(BusinessEventConstant.MSG_BOX, {
        type: 'warning',
        message: 'HTTP协议不支持复制粘贴！',
      });
      return;
    }
    try {
      Object.keys(data.data.spanCells).forEach((key) => {
        let [row, column] = key.split('_').map(Number);
        row -= data.scope.leftTopCell.row;
        column -= data.scope.leftTopCell.column;
        for (let r = row; r < row + data.data.spanCells[key].span[1]; r++) {
          for (let c = column; c < column + data.data.spanCells[key].span[0]; c++) {
            data.data.cells[r][c].content = '';
          }
        }
        data.data.cells[row][column].content = data.data.spanCells[key].content;
      });
      const textContent = data.data.cells.map((row) => row.map((cell) => cell.content).join('\t')).join('\n');

      const _data = [
        new ClipboardItem({
          // 'text/html': new Blob([JSON.stringify(data)], { type: 'text/html' }),
          'text/plain': new Blob([textContent], { type: 'text/plain' }),
        }),
      ];
      navigator.clipboard.write(_data);
      this.registerOnceDashBorder(data);
    } catch (e) {}
  }

  private registerOnceDashBorder(data: BaseDataType) {
    this._this.resetRenderFunction(RenderZIndex.DASH_SELLS_BORDER);
    this._this.addRenderFunction(RenderZIndex.DASH_SELLS_BORDER, [
      ((ctx: CanvasRenderingContext2D) => {
        ctx.save();
        const [x, y, w, h] = this._this.calBorder(data.scope.leftTopCell, data.scope.rightBottomCell);
        this._this._data.h;
        ctx.strokeStyle = '#4a89fe';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.setLineDash([5]);
        ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
        ctx.restore();
      }).bind(this),
    ]);
    this._this.render();
    this._this.once(EventConstant.EXCEL_CHANGE, () => {
      this._this.resetRenderFunction(RenderZIndex.DASH_SELLS_BORDER);
    });
  }
}
