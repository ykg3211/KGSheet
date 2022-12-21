import { PluginTypeEnum } from '..';
import Base, { SelectedCellType } from '../../base/base';
import { EventZIndex, RenderZIndex } from '../../base/constant';
import { combineCell, combineRect, deepClone, isSame, judgeCross, judgeInner, mapObject } from '../../../utils';
import { EventConstant, ToolsEventConstant } from '../base/event';
import KeyboardPlugin from '../KeyboardPlugin';
import { BASE_KEYS_ENUM, META, OPERATE_KEYS_ENUM } from '../KeyboardPlugin/constant';
import { CellCornerScopeType } from './EditCellPlugin';
import { SpanCell } from '../../../interfaces';
import { createDefaultStyle } from '../../../utils/defaultData';

type ArrowType =
  | OPERATE_KEYS_ENUM.ArrowDown
  | OPERATE_KEYS_ENUM.ArrowRight
  | OPERATE_KEYS_ENUM.ArrowLeft
  | OPERATE_KEYS_ENUM.ArrowUp;

export interface borderType {
  anchor: [number, number];
  w: number;
  h: number;
}

export enum selectTypeEnum {
  row = 'row',
  normal = 'normal',
  column = 'column',
}

export type selectedCellsType = SelectedCellType[][];

export default class SelectPowerPlugin {
  public name: string;
  private _this: Base;
  private KeyboardPlugin!: KeyboardPlugin;

  public _selectedCells: CellCornerScopeType | undefined; // 真正框选中的格子

  public selectCell!: SelectedCellType | null; // 真正选中的格子
  public _startCell: SelectedCellType | null; // 下面的是用来画框框的 选择 一开始的格子
  public _endCell: SelectedCellType | null; // 下面的是用来画框框的 选择 结尾的格子
  public _borderPosition: borderType | null | undefined; // 当前绘制的边框的位置信息

  // 用来标记是不是点击边框选中的一行或者一列
  public selectType: null | selectTypeEnum;

  private fillRectWidth: number;
  private strokeRectWidth: number;

  private moveToViewShadow: any;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.SelectPowerPlugin;
    this._this = _this;
    this._startCell = null;
    this._endCell = null;
    this.selectType = null;
    this._borderPosition = null;
    this.initCellClick();
    this.registerRenderFunc();
    this.fillRectWidth = 4;
    this.strokeRectWidth = 5;

    this.registerKeyboardEvent();
    this.initMoveToView();
  }

  // 计算时选中的格子。主要是为了解决spanCell的。
  public get selectedCells() {
    return this._selectedCells;
  }
  public set selectedCells(v) {
    if (!isSame(this._selectedCells, v)) {
      this._this.devMode && console.log('SelectCellsChanged', v);
      this._this.emit(EventConstant.SELECT_CELLS_CHANGE, v);
    }
    this._selectedCells = v;
  }

  public get isSelect() {
    return this._startCell && this._endCell;
  }

  // 获取选中的格子
  public getSelectCellsScope(): CellCornerScopeType | null {
    if (this.selectedCells) {
      return this.selectedCells;
    }
    return null;
  }

  public setSelectCellsScope({ leftTopCell, rightBottomCell }: CellCornerScopeType) {
    this._startCell = leftTopCell;
    this._endCell = rightBottomCell;
  }

  public remove() {
    this._this.devMode && console.log('remove: SelectPowerPlugin');
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS, []);
    this._this.un(EventConstant.SELECT_CELL_MOVE_TO_VIEW, this.moveToViewShadow);
  }

  private initMoveToView() {
    this.moveToViewShadow = this.moveToView.bind(this);
    this._this.on(EventConstant.SELECT_CELL_MOVE_TO_VIEW, this.moveToViewShadow);
  }

  private registerRenderFunc() {
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS, [
      (ctx) => {
        if (!this.isSelect) {
          return;
        }
        const border = this.calcBorder();
        if (!border) {
          return;
        }
        this._borderPosition = border.cellPosition;
        this.selectedCells = border.cellScope;
        if (this._borderPosition) {
          this.drawSelectedBorder(ctx, this._borderPosition);
        }
      },
    ]);

    // 绘制选中单元格之后在X Y轴的映射线
    this._this.resetRenderFunction(RenderZIndex.SELECT_CELLS_SIDEBAR_LINE, [
      (ctx) => {
        if (!this.isSelect) {
          return;
        }
        if (this._borderPosition) {
          this.drawSideBarLine(ctx, this._borderPosition);
        }
      },
    ]);
  }

  public getNextCellByMove(_cell: SelectedCellType | null, arrow: ArrowType) {
    const { cells, isSpan } = this._this.getSpanCellByCell({ cell: _cell });
    if (cells && _cell) {
      const cell = deepClone(_cell);
      if (isSpan) {
        cell.column = cells[0].column;
        cell.row = cells[0].row;
        const { span, content } = this._this.getSpanCell(cell) as SpanCell;
        const [r, c] = content.split('_').map(Number);

        switch (arrow) {
          case OPERATE_KEYS_ENUM.ArrowDown:
            cell.column = _cell.column;
            cell.row = cell.row + span[1];
            break;
          case OPERATE_KEYS_ENUM.ArrowRight:
            cell.row = _cell.row;
            cell.column = cell.column + span[0];
            break;
          case OPERATE_KEYS_ENUM.ArrowLeft:
            cell.row = _cell.row;
            cell.column = cell.column - 1;
            break;
          case OPERATE_KEYS_ENUM.ArrowUp:
            cell.column = _cell.column;
            cell.row = cell.row - 1;
            break;
          default:
            break;
        }
      } else {
        switch (arrow) {
          case OPERATE_KEYS_ENUM.ArrowDown:
            cell.row += 1;
            break;
          case OPERATE_KEYS_ENUM.ArrowRight:
            cell.column += 1;
            break;
          case OPERATE_KEYS_ENUM.ArrowLeft:
            cell.column -= 1;
            break;
          case OPERATE_KEYS_ENUM.ArrowUp:
            cell.row -= 1;
            break;
          default:
            break;
        }
      }
      cell.column = Math.max(cell.column, 0);
      cell.row = Math.max(cell.row, 0);
      cell.column = Math.min(cell.column, this._this._data.w.length - 1);
      cell.row = Math.min(cell.row, this._this._data.h.length - 1);

      return cell;
    }
    return _cell;
  }

  private registerKeyboardEvent() {
    const KeyboardPlugin = this._this.getPlugin(PluginTypeEnum.KeyboardPlugin);
    if (KeyboardPlugin) {
      this.KeyboardPlugin = KeyboardPlugin;

      this.initSingleArrow();
      this.initCombineArrow();
      this.initSelectAll();
    }
  }
  private initSelectAll() {
    const selectAll = () => {
      this._startCell = {
        row: 0,
        column: 0,
      };
      this._endCell = {
        row: this._this.data.h.length - 1,
        column: this._this.data.w.length - 1,
      };
      this._this.render();
    };

    this.KeyboardPlugin.register({
      baseKeys: [META],
      mainKeys: [OPERATE_KEYS_ENUM.a],
      callbacks: [
        () => {
          selectAll();
        },
      ],
    });
  }

  private initSingleArrow() {
    const selectCellMode = (type: ArrowType) => {
      if (this.selectCell) {
        const mirror = deepClone(this.selectCell);
        const nextCell = this.getNextCellByMove(mirror, type);
        this._startCell = deepClone(nextCell);
        this._endCell = deepClone(nextCell);
        this.selectCell = nextCell;
        this._this.render();
        this._this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
      }
    };

    this.KeyboardPlugin.register({
      baseKeys: [],
      mainKeys: OPERATE_KEYS_ENUM.ArrowDown,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowDown);
        },
      ],
    });
    this.KeyboardPlugin.register({
      baseKeys: [],
      mainKeys: OPERATE_KEYS_ENUM.ArrowRight,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowRight);
        },
      ],
    });
    this.KeyboardPlugin.register({
      baseKeys: [],
      mainKeys: OPERATE_KEYS_ENUM.ArrowLeft,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowLeft);
        },
      ],
    });
    this.KeyboardPlugin.register({
      baseKeys: [],
      mainKeys: OPERATE_KEYS_ENUM.ArrowUp,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowUp);
        },
      ],
    });
  }

  private initCombineArrow() {
    const selectCellMode = (type: ArrowType) => {
      const mirror = deepClone(this._endCell);
      const nextCell = this.getNextCellByMove(mirror, type);
      this._endCell = nextCell;
      this._this.render();
      this._this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
    };

    this.KeyboardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Shift],
      mainKeys: OPERATE_KEYS_ENUM.ArrowDown,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowDown);
        },
      ],
    });
    this.KeyboardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Shift],
      mainKeys: OPERATE_KEYS_ENUM.ArrowRight,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowRight);
        },
      ],
    });
    this.KeyboardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Shift],
      mainKeys: OPERATE_KEYS_ENUM.ArrowLeft,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowLeft);
        },
      ],
    });
    this.KeyboardPlugin.register({
      baseKeys: [BASE_KEYS_ENUM.Shift],
      mainKeys: OPERATE_KEYS_ENUM.ArrowUp,
      callbacks: [
        () => {
          selectCellMode(OPERATE_KEYS_ENUM.ArrowUp);
        },
      ],
    });
  }

  private initCellClick() {
    let isMouseDown_normalCell = false;
    let isMouseDown_top_Cell = false;
    let isMouseDown_left_Cell = false;
    const mouseDownCB = (e: any, point: [number, number]) => {
      const cell = this._this.getCellByPoint(point);
      if (!cell) {
        return;
      }

      this.selectCell = cell;
      if (cell.row !== -1 && cell.column !== -1) {
        // 正常开局，点的是中间的单元格

        if (!this.KeyboardPlugin.OperateState[BASE_KEYS_ENUM.Shift]) {
          this._startCell = cell;
        }
        this._endCell = cell;

        isMouseDown_normalCell = true;
        this.selectType = selectTypeEnum.normal;
        this._this.render();
      } else if (cell.row === -1 && cell.column === -1) {
        //点击了最左上角 全选
        this._startCell = {
          row: 0,
          column: 0,
        };
        this._endCell = {
          row: this._this.data.h.length - 1,
          column: this._this.data.w.length - 1,
        };
        this.selectType = selectTypeEnum.normal;
        this._this.render();
      } else if (cell.row === -1) {
        //点击了上边框， 则选中一列
        this._startCell = {
          row: 0,
          column: cell.column,
        };
        this._endCell = {
          row: this._this.data.h.length - 1,
          column: cell.column,
        };
        isMouseDown_top_Cell = true;
        this.selectType = selectTypeEnum.column;
        this._this.render();
      } else if (cell.column === -1) {
        //点击了左边框， 则选中一行
        this._startCell = {
          row: cell.row,
          column: 0,
        };
        this._endCell = {
          row: cell.row,
          column: this._this.data.w.length - 1,
        };
        isMouseDown_left_Cell = true;
        this.selectType = selectTypeEnum.row;
        this._this.render();
      }
    };

    this._this.setEvent([EventConstant.MOUSE_DOWN, EventConstant.TOUCH_START], {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }

        return point;
      },
      innerFunc: mouseDownCB.bind(this),
      outerFunc: () => {
        // this.selectCell = null;
        // this._startCell = null;
        // this._endCell = null;
        // this._borderPosition = null;
        // this._this._render();
      },
    });

    const mouseMoveCB = (e: any, point: [number, number]) => {
      // 超过左边框还能识别的兼容
      const cell = this._this.getCellByPoint([
        Math.max(this._this.paddingLeft + 1, point[0]),
        Math.max(this._this.paddingTop + 1, point[1]),
      ]);
      if (!cell) {
        return;
      }

      if (isMouseDown_normalCell) {
        if (cell.row !== -1 && cell.column !== -1) {
          this._endCell = cell;
        } else if (cell.row === -1 && cell.column === -1) {
          this._endCell = {
            row: this._this.renderDataScope[0][0],
            column: this._this.renderDataScope[0][1],
          };
        } else if (cell.row === -1) {
          if (this._endCell) {
            this._endCell.column = cell.column;
          }
        } else if (cell.column === -1) {
          if (this._endCell) {
            this._endCell.row = cell.row;
          }
        }
      } else if (isMouseDown_top_Cell) {
        if (this._endCell) {
          this._endCell.column = cell.column;
        }
      } else if (isMouseDown_left_Cell) {
        if (this._endCell) {
          this._endCell.row = cell.row;
        }
      }

      this._this.getPlugin(PluginTypeEnum.CornerAutoMove)?.start();

      this._this.render();
    };

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e, true);
        if (!point) {
          return false;
        }
        if (this._startCell && (isMouseDown_normalCell || isMouseDown_top_Cell || isMouseDown_left_Cell)) {
          return point;
        }
        return false;
      },
      innerFunc: mouseMoveCB.bind(this),
    });

    const mouseUpCB = () => {
      isMouseDown_normalCell = false;
      isMouseDown_top_Cell = false;
      isMouseDown_left_Cell = false;
    };

    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: () => {
        if (this._startCell && (isMouseDown_normalCell || isMouseDown_top_Cell || isMouseDown_left_Cell)) {
          return true;
        }
        return false;
      },
      innerFunc: mouseUpCB.bind(this),
    });
  }

  public clearStyle() {
    const scope = this.getSelectCellsScope();
    if (!scope) {
      return;
    }
    const sourceData = this._this.getDataByScope(scope);
    const targetData = deepClone(sourceData);

    targetData.data.cells = targetData.data.cells.map((row) => {
      return row.map((cell) => {
        cell.style = createDefaultStyle();
        return cell;
      });
    });

    mapObject(targetData.data.spanCells, (v) => {
      v.style = createDefaultStyle();
      return v;
    });

    this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.cellsChange({
      scope,
      pre_data: sourceData.data,
      after_data: targetData.data,
    });
    // 用来计算toolBar的按钮状态的
    this._this.ToolBar?.emit(ToolsEventConstant.REFRESH_ATTRIBUTES_STATE);
  }

  public calcBorder() {
    if (!(this._startCell && this._endCell)) {
      return null;
    }

    let startCell: SelectedCellType = {
      row: Math.min(this._startCell.row, this._endCell.row),
      column: Math.min(this._startCell.column, this._endCell.column),
    };
    let endCell: SelectedCellType = {
      row: Math.max(this._startCell.row, this._endCell.row),
      column: Math.max(this._startCell.column, this._endCell.column),
    };
    const { _data, paddingLeft, paddingTop, scrollLeft, scrollTop, renderSpanCellsArr } = this._this;

    const cellPosition: borderType = {
      anchor: [
        _data.w.slice(0, startCell.column).reduce((a, b) => a + b, 0) + paddingLeft - scrollLeft,
        _data.h.slice(0, startCell.row).reduce((a, b) => a + b, 0) + paddingTop - scrollTop,
      ],
      w: _data.w.slice(startCell.column, endCell.column + 1).reduce((a, b) => a + b, 0),
      h: _data.h.slice(startCell.row, endCell.row + 1).reduce((a, b) => a + b, 0),
    };

    const crossSpanCells: SelectedCellType[] = [startCell, endCell];

    renderSpanCellsArr.forEach((cell) => {
      if (
        judgeCross(
          [cell.point[0], cell.point[1], cell.w, cell.h],
          [cellPosition.anchor[0], cellPosition.anchor[1], cellPosition.w, cellPosition.h],
        )
      ) {
        const temp = combineRect(
          [cell.point[0], cell.point[1], cell.w, cell.h],
          [cellPosition.anchor[0], cellPosition.anchor[1], cellPosition.w, cellPosition.h],
        );

        crossSpanCells.push({
          row: cell.location.row,
          column: cell.location.column,
        });
        crossSpanCells.push({
          row: cell.location.row + cell.cell.span[1] - 1,
          column: cell.location.column + cell.cell.span[0] - 1,
        });

        cellPosition.anchor[0] = temp[0];
        cellPosition.anchor[1] = temp[1];
        cellPosition.w = temp[2];
        cellPosition.h = temp[3];
      }
    });

    if (crossSpanCells.length > 2) {
      const { leftTopCell, rightBottomCell } = combineCell(crossSpanCells);
      startCell = leftTopCell;
      endCell = rightBottomCell;
    }

    return {
      cellPosition,
      cellScope: {
        leftTopCell: startCell,
        rightBottomCell: endCell,
      } as CellCornerScopeType,
    };
  }

  private drawSideBarLine(ctx: CanvasRenderingContext2D, { anchor, w, h }: borderType) {
    ctx.save();
    ctx.strokeStyle = '#4a89fe';
    ctx.lineWidth = 3;
    // 画x轴
    ctx.beginPath();
    const x_1 = Math.max(anchor[0], this._this.paddingLeft);
    const x_2 = anchor[0] + w;
    if (x_2 > x_1) {
      ctx.moveTo(x_1, this._this.paddingTop);
      ctx.lineTo(x_2, this._this.paddingTop);
    }
    ctx.stroke();

    // 画y轴
    ctx.beginPath();
    const y_1 = Math.max(anchor[1], this._this.paddingTop);
    const y_2 = anchor[1] + h;
    if (y_2 > y_1) {
      ctx.moveTo(this._this.paddingLeft, y_1);
      ctx.lineTo(this._this.paddingLeft, y_2);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawSelectedBorder(ctx: CanvasRenderingContext2D, { anchor, w, h }: borderType) {
    ctx.save();
    ctx.strokeStyle = '#4a89fe';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.strokeRect(anchor[0], anchor[1], w, h);

    ctx.fillStyle = 'rgba(74,137,254,0.05)';
    ctx.fillRect(anchor[0], anchor[1], w, h);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#4a89fe';
    ctx.fillRect(
      anchor[0] + w - this.fillRectWidth / 2,
      anchor[1] + h - this.fillRectWidth / 2,
      this.fillRectWidth,
      this.fillRectWidth,
    );
    ctx.strokeRect(
      anchor[0] + w - this.strokeRectWidth / 2,
      anchor[1] + h - this.strokeRectWidth / 2,
      this.strokeRectWidth,
      this.strokeRectWidth,
    );
    ctx.restore();
  }

  public selectCells({ leftTopCell, rightBottomCell }: CellCornerScopeType) {
    this.selectCell = leftTopCell;
    this._startCell = leftTopCell;
    this._endCell = rightBottomCell;
  }

  public moveToView() {
    if (!this._endCell) {
      return;
    }
    const that = this._this;
    const [x, y, w, h] = this._this.getRectByCell(this._endCell);
    const width = that._width - that.paddingLeft - that.scrollBarWidth;
    const height = that._height - that.paddingTop - that.scrollBarWidth;
    const isInner = judgeInner([x, y, w, h], [that.paddingLeft, that.paddingTop, width, height]);
    if (!isInner) {
      if (x < that.paddingLeft) {
        that.scrollXY(x - that.paddingLeft - 20, 0);
      }
      if (y < that.paddingTop) {
        that.scrollXY(0, y - that.paddingTop - 20);
      }
      if (x + w > width) {
        that.scrollXY(x + w - width - 20, 0);
      }
      if (y + h > height) {
        that.scrollXY(0, y + h - height - 10);
      }
    }
  }
}
