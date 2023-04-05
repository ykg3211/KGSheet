import { PluginTypeEnum } from '..';
import { Cell, createDefaultCell } from '../../..';
import { BASE_HEIGHT, BASE_WIDTH } from '../../../utils/defaultData';
import { ExcelConfig, SpanCell } from '../../../interfaces';
import Base from '../../base/base';
import BaseEventStack, { BaseEventType } from './base';
import { EventConstant } from '../base/event';
import { deepClone, judgeCellType } from '../../../utils';
import { BaseAddRemoveRowsColumnsType, BaseCellChangeType, BaseCellsMoveType, RowColumnResizeType } from './interface';

export default class ExcelBaseFunction {
  private _this: Base;
  private name: string;
  private EventStackPlugin!: BaseEventStack;

  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.ExcelBaseFunction;

    const EventStack = this._this.getPlugin(PluginTypeEnum.EventStack);
    if (EventStack) {
      this.EventStackPlugin = EventStack;
    } else {
      console.error('ExcelBaseFunction 依赖于 EventStack, 请正确注册插件!');
    }
  }

  private _cellsChange({ scope, pre_data, after_data }: BaseCellChangeType, isReverse = false) {
    const after = isReverse ? pre_data : after_data;
    const pre = isReverse ? after_data : pre_data;

    Object.keys(pre.spanCells).forEach((spanCell) => {
      delete this._this._data.spanCells[spanCell];
    });
    this._this.setDataByScope({
      scope,
      data: after,
    });

    this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin)?.selectCells(scope);
    this._this.emit(EventConstant.EXCEL_CHANGE, {
      scope,
      pre_data,
      after_data,
    });
  }

  public cellsChange({ scope, pre_data, after_data }: BaseCellChangeType, immediate = true) {
    // 判断是不是url的类型
    after_data.cells = after_data.cells.map((cells) => {
      return cells.map((cell) => {
        cell.type = judgeCellType(cell);
        return cell;
      });
    });

    this.EventStackPlugin.push(
      [
        {
          params: {
            scope,
            pre_data,
            after_data,
            time_stamp: new Date(),
          },
          // @ts-ignore
          func: this._cellsChange.bind(this),
        },
      ],
      immediate,
    );
  }

  public cellsMove({ pre_data, after_data, time_stamp }: BaseCellsMoveType) {
    this.EventStackPlugin.push([
      {
        params: {
          ...pre_data,
          time_stamp,
        },
        // @ts-ignore
        func: this._cellsChange.bind(this),
      },
      {
        params: {
          ...after_data,
          time_stamp,
        },
        // @ts-ignore
        func: this._cellsChange.bind(this),
      },
    ]);
  }

  private baseHandleSpanCell(prop: { isAdd: boolean; isRow: boolean; index: number; length: number }) {
    const { isAdd, isRow, index, length } = prop;
    const deleteKeys: string[] = [];
    const newSpanCells: Record<string, SpanCell> = {};
    Object.entries(this._this.data.spanCells).forEach(([key, _value]) => {
      let [row, column] = key.split('_').map(Number);
      let value = deepClone(_value);
      deleteKeys.push(key);
      if (isAdd) {
        if (isRow) {
          if (index <= row) {
            row += length;
          }
          if (index > row && index < row + value.span[1]) {
            value.span[1] += length;
          }
        } else {
          if (index <= column) {
            column += length;
          }
          if (index > column && index < column + value.span[0]) {
            value.span[0] += length;
          }
        }
      } else {
        if (isRow) {
          if (index < row) {
            row -= length;
          }
          if (index > row && index < row + value.span[1]) {
            value.span[1] -= length;
          }
        } else {
          if (index < column) {
            column -= length;
          }
          if (index > column && index < column + value.span[0]) {
            value.span[0] -= length;
          }
        }
      }
      newSpanCells[`${row}_${column}`] = value;
    });

    deleteKeys.forEach((key) => {
      delete this._this.data.spanCells[key];
    });
    this._this.data.spanCells = { ...this._this.data.spanCells, ...newSpanCells };
  }

  public _addRemoveRowsColumns({ isAdd, isRow, index, excel }: BaseAddRemoveRowsColumnsType, isReverse = false) {
    const add = isReverse ? !isAdd : isAdd;
    const { cells } = excel;
    if (add) {
      // 添加行列
      if (isRow) {
        this._this.data.cells.splice(index, 0, ...cells);
        this._this.data.h.splice(index, 0, ...new Array(cells.length).fill(BASE_HEIGHT));
      } else {
        this._this.data.cells = this._this.data.cells.map((row, i) => {
          row.splice(index, 0, ...cells[i]);
          return row;
        });
        this._this.data.w.splice(index, 0, ...new Array(cells[0].length).fill(BASE_WIDTH));
      }
    } else {
      // 删除行列
      if (isRow) {
        this._this.data.cells.splice(index, cells.length);
        this._this.data.h.splice(index, cells.length);
      } else {
        this._this.data.cells = this._this.data.cells.map((row, i) => {
          row.splice(index, cells[i].length);
          return row;
        });
        this._this.data.w.splice(index, cells[0].length);
      }
    }

    const length = isRow ? cells.length : cells[0].length;
    this.baseHandleSpanCell({ isAdd: add, isRow, index, length });
    this._this.render();
  }

  // 用于添加和删除整行和整列的方法
  public addRemoveRowsColumns(props: BaseAddRemoveRowsColumnsType[]) {
    const events = props.map((prop) => ({
      params: prop,
      // @ts-ignore
      func: this._addRemoveRowsColumns.bind(this),
    }));
    this.EventStackPlugin.push(events as BaseEventType[], true);
  }

  private _rowColumnResize({ isRow, index, preWidth, afterWidth }: RowColumnResizeType, isReverse = false) {
    const after = isReverse ? preWidth : afterWidth;

    this._this._data[isRow ? 'h' : 'w'][index] = after;
    this._this.render();
  }

  public rowColumnResize(data: RowColumnResizeType) {
    const time_stamp = new Date();
    this.EventStackPlugin.push([
      {
        params: {
          ...data,
          time_stamp,
        },
        // @ts-ignore
        func: this._rowColumnResize.bind(this),
      },
    ]);
  }
}
