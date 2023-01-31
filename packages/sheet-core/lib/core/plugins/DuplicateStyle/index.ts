import { createDefaultCell } from '../../../utils/defaultData';
import { PluginTypeEnum } from '..';
import { deepClone, handleCell } from '../../../utils';
import { html2excel } from '../../../utils/htmlParse';
import Base, { BaseDataType } from '../../base/base';
import { RenderZIndex } from '../../base/constant';
import { BusinessEventConstant, EventConstant, ToolsEventConstant } from '../base/event';
import ExcelBaseFunction from '../EventStack';
import KeyboardPlugin from '../KeyboardPlugin';
import { META, OPERATE_KEYS_ENUM } from '../KeyboardPlugin/constant';
import { CellCornerScopeType } from '../SelectAndInput/EditCellPlugin';
import SelectPowerPlugin from '../SelectAndInput/SelectPowerPlugin';
import { SpanCell } from '../../../interfaces';

/**
 * Chrome 浏览器规定，只有 HTTPS 协议的页面才能使用这个 API。
 * 所以在http的页面这个功能是烂掉的，
 */

export default class DuplicateStyle {
  public name: string;
  private _this: Base;
  private SelectPlugin!: SelectPowerPlugin;
  private ExcelBaseFunction!: ExcelBaseFunction;

  private targetData: null | BaseDataType;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.DuplicateStyle;
    this._this = _this;
    this.targetData = null;
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

    const ExcelBaseFunction = this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction);
    if (ExcelBaseFunction) {
      this.ExcelBaseFunction = ExcelBaseFunction;
    } else {
      console.error('CommonInputPlugin 依赖于 KeyboardPlugin, 请正确注册插件!');
      return;
    }
  }

  public startDuplicateStyle() {
    this.SelectPlugin.getSelectCellsScope();
    const border = this.SelectPlugin.getSelectCellsScope();
    if (border) {
      const data = this._this.getDataByScope({
        leftTopCell: border.leftTopCell,
        rightBottomCell: border.rightBottomCell,
      });
      this.registerOnceDuplicate(data);
    }
  }

  private duplicateStyle(scope: CellCornerScopeType | undefined) {
    if (!scope || !this.targetData) {
      return;
    }
    const _row = this.targetData.scope.rightBottomCell.row - this.targetData.scope.leftTopCell.row;
    const _column = this.targetData.scope.rightBottomCell.column - this.targetData.scope.leftTopCell.column;
    scope.rightBottomCell.row = scope.leftTopCell.row + _row;
    scope.rightBottomCell.column = scope.leftTopCell.column + _column;

    const { data: sourceData } = this._this.getDataByScope(scope);

    const targetData = handleCell(sourceData, (cell, point) => {
      if (point) {
        const { row, column, isSpanCell } = point;
        if (isSpanCell) {
          // @ts-ignore
          cell.style = this.targetData.data.cells[row - scope.leftTopCell.row][column - scope.leftTopCell.column].style;
        } else {
          // @ts-ignore
          cell.style = this.targetData.data.cells[row][column].style;
        }
      }
      return cell;
    });

    // Object.keys(this.targetData.data.spanCells).forEach((key) => {
    //   // @ts-ignore
    //   const spanCell = this.targetData.data.spanCells[key];
    //   const [row, column] = key.split('_').map(Number);
    //   // @ts-ignore
    //   const newRow = row + scope.leftTopCell.row - this.targetData.scope.leftTopCell.row;
    //   // @ts-ignore
    //   const newColumn = column + scope.leftTopCell.column - this.targetData.scope.leftTopCell.column;
    //   const newSpanCell: SpanCell = {
    //     ...createDefaultCell(),
    //     style: spanCell.style,
    //     span: spanCell.span,
    //   };
    //   targetData.spanCells[`${newRow}_${newColumn}`] = newSpanCell;
    // });

    this.ExcelBaseFunction?.cellsChange({
      scope,
      pre_data: sourceData,
      after_data: targetData,
    });
  }

  private registerOnceDuplicate(data: BaseDataType) {
    this.targetData = data;

    this._this.emit(ToolsEventConstant.DUPLICATE_STYLE_STATE_CHANGE, true);
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
    this._this.once(EventConstant.SELECT_CELLS_CHANGE, (v) => {
      this.duplicateStyle(deepClone(v));
      this._this.emit(ToolsEventConstant.DUPLICATE_STYLE_STATE_CHANGE, false);
    });
  }
}
