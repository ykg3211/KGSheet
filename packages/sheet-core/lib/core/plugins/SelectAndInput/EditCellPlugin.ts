// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from '..';
import Base, { SelectedCellType } from '../../base/base';
import { EventZIndex, RenderZIndex } from '../../base/constant';
import { RectType } from '../../base/drawLayer';
import { Cell, CellTypeEnum, SpanCell } from '../../../interfaces';
import { combineCell, deepClone, isSameArray, judgeOver } from '../../../utils';
import { createDefaultCell } from '../../../utils/defaultData';
import { BusinessEventConstant, EventConstant, ToolsEventConstant } from '../base/event';
import ExcelBaseFunction from '../EventStack';
import KeyboardPlugin from '../KeyboardPlugin';
import { BASE_KEYS_ENUM, CONTENT_KEYS, FN_KEY, OPERATE_KEYS_ENUM } from '../KeyboardPlugin/constant';
import SelectPowerPlugin, { selectTypeEnum } from './SelectPowerPlugin';
import { InputDom } from './InputDom';
import { handleRegularData, regularArrowEnum } from './regularFunc';

export interface CellCornerScopeType {
  leftTopCell: SelectedCellType;
  rightBottomCell: SelectedCellType;
}

export interface MoveCellsType {
  isRow: boolean;
  index: number;
  length: number;
}

export default class EditCellPlugin {
  public name: string;
  private _this: Base;
  private KeyboardPlugin!: KeyboardPlugin;
  private SelectPlugin!: SelectPowerPlugin;
  private ExcelBaseFunction!: ExcelBaseFunction;
  private editDomInstance!: null | InputDom;
  private editCell!: null | SelectedCellType;

  private pointDownCell!: null | SelectedCellType; // 剪切单元格专用的，记录鼠标点下去的时候的cell位置。
  private startCopyCell!: null | CellCornerScopeType; // 这个是用户拖拽单元格边框的标志， 用处是剪切单元格。

  private startRegularCell!: null | CellCornerScopeType; // 这个是用户拖拽单元格右下角开始的标志， 用处就是有规则的扩展单元格
  private endRegularCell!: null | CellCornerScopeType; // 这个是用户拖拽单元格右下角结束的标志， 用处就是有规则的扩展单元格
  private currentCell!: null | SelectedCellType; // 拖拽的时候鼠标的落点，用于计算的
  private regularArrow!: regularArrowEnum; // 拖拽的时候鼠标的落点，用于计算的

  private startMoveCells!: null | MoveCellsType; // 这个是批量拖动cells的标志。
  private latestRowsColumns!: null | number; // 最新的行列

  private resetParams: any;
  constructor(_this: Base) {
    this.name = PluginTypeEnum.EditCellPlugin;
    this._this = _this;

    this.initPlugin();
    this.registerKeyboardEvent();

    this.initEvent();
    this.addRenderFunc();
    this.transformEditDom();
    this.initResetParams();
    this.initToolBarShadowInput();
  }

  private initPlugin() {
    const SelectPowerPlugin = this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin);
    if (SelectPowerPlugin) {
      this.SelectPlugin = SelectPowerPlugin;
    } else {
      console.error('CommonInputPlugin 依赖于 SelectPowerPlugin, 请正确注册插件!');
    }
    const ExcelBaseFunction = this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction);
    if (ExcelBaseFunction) {
      this.ExcelBaseFunction = ExcelBaseFunction;
    } else {
      console.error('CommonInputPlugin 依赖于 ExcelBaseFunction, 请正确注册插件!');
    }
  }

  private initResetParams() {
    this.resetParams = this._resetParams.bind(this);
    this._this.on(EventConstant.BLUR_FOCUS_RESET_PARAMS, this.resetParams);
  }

  private remove() {
    this._this.devMode && console.log('remove: EditCellPlugin');
    this._this.un(EventConstant.BLUR_FOCUS_RESET_PARAMS, this.resetParams);
  }

  private _resetParams() {
    this.pointDownCell = null;
    this.startCopyCell = null;
    this.startRegularCell = null;
  }

  private registerKeyboardEvent() {
    const KetBoardPlugin = this._this.getPlugin(PluginTypeEnum.KeyboardPlugin);
    if (KetBoardPlugin) {
      this.KeyboardPlugin = KetBoardPlugin;

      this.KeyboardPlugin.register({
        mainKeys: OPERATE_KEYS_ENUM.Escape,
        callbacks: [
          (e) => {
            e.preventDefault();
            this.removeDom();
          },
        ],
      });

      // tab处理
      const tabCB = (isLeft: boolean) => {
        this.removeDom();
        if (this.SelectPlugin.selectCell) {
          const mirror = deepClone(this.SelectPlugin.selectCell);
          const nextCell = this.SelectPlugin.getNextCellByMove(mirror, isLeft ? OPERATE_KEYS_ENUM.ArrowLeft : OPERATE_KEYS_ENUM.ArrowRight);

          this.SelectPlugin._startCell = deepClone(nextCell);
          this.SelectPlugin._endCell = deepClone(nextCell);
          this.SelectPlugin.selectCell = nextCell;
          this._this.render();
          this._this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
        }
      };
      this.KeyboardPlugin.register({
        baseKeys: [],
        mainKeys: OPERATE_KEYS_ENUM.Tab,
        callbacks: [
          (e) => {
            e.preventDefault();
            tabCB(false);
          },
        ],
      });
      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Shift],
        mainKeys: OPERATE_KEYS_ENUM.Tab,
        callbacks: [
          (e) => {
            e.preventDefault();
            tabCB(true);
          },
        ],
      });

      // 回车处理
      const enterCB = (isUp: boolean) => {
        this.removeDom();
        if (this.SelectPlugin.selectCell) {
          const mirror = deepClone(this.SelectPlugin.selectCell);
          const nextCell = this.SelectPlugin.getNextCellByMove(mirror, isUp ? OPERATE_KEYS_ENUM.ArrowUp : OPERATE_KEYS_ENUM.ArrowDown);

          this.SelectPlugin._startCell = deepClone(nextCell);
          this.SelectPlugin._endCell = deepClone(nextCell);
          this.SelectPlugin.selectCell = nextCell;
          this._this.render();
          this._this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
        }
      };
      this.KeyboardPlugin.register({
        baseKeys: [],
        mainKeys: OPERATE_KEYS_ENUM.Enter,
        callbacks: [
          (e) => {
            e.preventDefault();
            enterCB(false);
          },
        ],
      });

      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Shift],
        mainKeys: OPERATE_KEYS_ENUM.Enter,
        callbacks: [
          (e) => {
            e.preventDefault();
            enterCB(true);
          },
        ],
      });

      // 所有输入内容的key的处理，主要是为了能呼出输入框
      this.KeyboardPlugin.register({
        mainKeys: Object.keys(CONTENT_KEYS).concat(FN_KEY.F2),
        callbacks: [
          (e, v) => {
            if (!this.SelectPlugin.selectCell) {
              return;
            }
            if (this.SelectPlugin.selectCell.row < 0 || this.SelectPlugin.selectCell.column < 0) {
              return;
            }
            this.initEditBoxDom(this.SelectPlugin.selectCell);
            if (this.editDomInstance && v.mainKeys !== FN_KEY.F2) {
              // 比较hack， 在这个dom上绑定了oninput的方法，借助这个方法可以执行到定义的时候的上下文，
              this.editDomInstance.inputInDom(v.mainKeys);
            }
          },
        ],
      });

      // 增加delete方法，清空content；
      this.KeyboardPlugin.register({
        mainKeys: [OPERATE_KEYS_ENUM.Backspace, OPERATE_KEYS_ENUM.Delete],
        callbacks: [
          (e, v) => {
            const border = this.SelectPlugin.calcBorder();
            if (!border) {
              return;
            }

            this.clearContentByScope({
              leftTopCell: border.cellScope.leftTopCell,
              rightBottomCell: border.cellScope.rightBottomCell,
            });
          },
        ],
      });
    }
  }

  private initToolBarShadowInput() {
    this._this.on(ToolsEventConstant.SHADOW_INPUT_FOCUS, (Z) => {
      if (this.SelectPlugin.selectCell) {
        this.initEditBoxDom(this.SelectPlugin.selectCell, {
          needFocus: false,
        });
      }
    });

    this._this.on(ToolsEventConstant.SHADOW_INPUT_CHANGE, (v) => {
      if (this.SelectPlugin.selectCell) {
        if (this.editDomInstance) {
          this.editDomInstance.inputInDom(v);
        } else {
          this.initEditBoxDom(this.SelectPlugin.selectCell);
          if (this.editDomInstance) {
            (this.editDomInstance as any).inputInDom(v);
          }
        }
      }
    });
  }

  // 增加delete方法，清空content；
  private clearContentByScope(scope: CellCornerScopeType) {
    const preData = this._this.getDataByScope(scope).data;
    const afterData = deepClone(preData);
    afterData.cells = afterData.cells.map((cells) =>
      cells.map((cell) => {
        cell.content = '';
        return cell;
      }),
    );

    Object.keys(afterData.spanCells).forEach((key) => {
      afterData.spanCells[key].content = '';
    });

    this.ExcelBaseFunction.cellsChange({
      scope,
      pre_data: preData,
      after_data: afterData,
    });
  }

  private addRenderFunc() {
    this._this.addRenderFunction(RenderZIndex.SELECT_CELLS, [
      (ctx) => {
        if (!this.currentCell) {
          return;
        }
        if (this.startRegularCell) {
          const { leftTopCell: startCell, rightBottomCell: endCell } = this.startRegularCell;
          const { currentCell } = this;
          const centerTag = {
            column: (startCell.column + endCell.column) / 2,
            row: (startCell.row + endCell.row) / 2,
          };
          const columnGap = Math.max(Math.abs(currentCell.column - centerTag.column) - Math.abs(startCell.column + endCell.column) / 2, 0);
          const rowGap = Math.max(Math.abs(currentCell.row - centerTag.row) - Math.abs(startCell.row - endCell.row) / 2, 0);

          if (columnGap >= rowGap) {
            this.regularArrow = currentCell.column > centerTag.column ? regularArrowEnum.LEFT2RIGHT : regularArrowEnum.RIGHT2LEFT;
            currentCell.row = endCell.row;
          } else {
            this.regularArrow = currentCell.row > centerTag.row ? regularArrowEnum.TOP2BOTTOM : regularArrowEnum.BOTTOM2TOP;
            currentCell.column = endCell.column;
          }

          const { leftTopCell, rightBottomCell } = combineCell([startCell, endCell, currentCell]);
          this.endRegularCell = {
            leftTopCell: leftTopCell,
            rightBottomCell: rightBottomCell,
          };
          this.drawDashBorder(ctx, this._this.calBorder(leftTopCell, rightBottomCell));

          return;
        }

        if (this.startCopyCell && this.pointDownCell) {
          const { leftTopCell, rightBottomCell } = this.getCurrentScopeInCopy() || {};
          if (leftTopCell && rightBottomCell) {
            this.drawDashBorder(ctx, this._this.calBorder(leftTopCell, rightBottomCell));
          }
        }
      },
    ]);

    this._this.addRenderFunction(RenderZIndex.BORDER_HIGH_LIGHT, [
      (ctx) => {
        if (!this.startMoveCells || !this.latestRowsColumns) {
          return;
        }

        this._this.drawRowColumnBorder({
          ctx,
          isRow: this.startMoveCells.isRow,
          index: this.latestRowsColumns - 1,
        });
      },
    ]);
  }

  private drawDashBorder(ctx: CanvasRenderingContext2D, rect: RectType) {
    ctx.save();
    ctx.strokeStyle = '#4a89fe';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.setLineDash([5]);
    ctx.strokeRect(...rect);
    ctx.restore();
  }

  private transformEditDom() {
    this._this.addRenderFunction(RenderZIndex.SCROLL_BAR, [
      () => {
        if (this.editCell && this.editDomInstance && this._this.canvasDom) {
          const position = this._this.getRectByCell(this.editCell).map((i) => i * this._this.scale) as RectType;

          position[0] += this._this.canvasDom.offsetLeft;
          position[1] += this._this.canvasDom.offsetTop;

          this.editDomInstance.resetEditDomPosition(...position);
        }
      },
    ]);
  }

  // 通用的判断鼠标是在边框还是右下角rect的方法
  private commonJudgeFunc(e: MouseEvent) {
    const point = this._this.transformXYInContainer(e);
    if (!point || !this.SelectPlugin._borderPosition) {
      return false;
    }
    const { anchor, w, h } = this.SelectPlugin._borderPosition;
    const strokeRectWidth = 4;

    // 判断是不是单元格内部
    if (judgeOver(point, [anchor[0] + strokeRectWidth / 2, anchor[1] + strokeRectWidth / 2, w - strokeRectWidth, h - strokeRectWidth])) {
      return false;
    }
    // 判断是不是单元格外部
    if (!judgeOver(point, [anchor[0] - strokeRectWidth / 2, anchor[1] - strokeRectWidth / 2, w + strokeRectWidth, h + strokeRectWidth])) {
      return false;
    }
    // 判断是不是右下角的小框
    if (judgeOver(point, [anchor[0] + w - strokeRectWidth / 2, anchor[1] + h - strokeRectWidth / 2, strokeRectWidth, strokeRectWidth])) {
      return ['grab', point];
    }

    // 剩下的肯定是边框了
    return ['cell', point];
  }

  private initEvent() {
    // 这个比较hack， 借助scrollbar最高的优先级，并且在judge方法中来判断鼠标有没有点到输入框的外部。 为了不管怎么样，都能运行到。
    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SCROLL_BAR,
      judgeFunc: (e) => {
        try {
          if (this.editDomInstance && e.target === this._this.canvasDom) {
            this.removeDom();
          }
        } catch (e) {}
        return false;
      },
      innerFunc: () => {},
    });

    this.handleMouseDown();
    this.handleDBClick();
    this.handleMoveRowsColumns();
    this.handleMouseMove();
    this.handleMouseUp();
  }

  private initEditBoxDom(
    cell: SelectedCellType,
    config?: {
      isDBClick?: boolean;
      needFocus?: boolean;
    },
  ) {
    const { isDBClick = false, needFocus = true } = config || {};
    this._this.devMode && console.log('InitEditBoxDom', cell);

    const { cells } = this._this.getSpanCellByCell({ cell });

    if (cells.length > 0) {
      cell = cells[0];
    }

    const originData = this._this.getRealCell(cell);

    if (!originData || originData.type === CellTypeEnum.image) {
      return;
    }

    this.SelectPlugin._startCell = this.SelectPlugin.selectCell;
    this.SelectPlugin._endCell = this.SelectPlugin.selectCell;

    const _position = this._this.getRectByCell(cell);

    /**
     * 解决双击过程中移动鼠标之后，会将dom挂载在最后的单元格的bug。
     */
    if (isDBClick) {
      const selectCells = this.SelectPlugin.getSelectCellsScope();
      if (!selectCells) {
        return;
      }
      const _border = this._this.calBorder(selectCells.leftTopCell, selectCells.rightBottomCell);
      if (!isSameArray(_border, _position)) {
        return;
      }
    }
    if (this._this.canvasDom) {
      this._this.emit(EventConstant.SELECT_CELL_MOVE_TO_VIEW);
      this.editCell = cell;

      const position = _position.map((i) => i * this._this.scale) as RectType;
      position[0] += this._this.canvasDom.offsetLeft;
      position[1] += this._this.canvasDom.offsetTop;

      this.createEditBox(this.editCell, position, needFocus);

      this.SelectPlugin.selectCell = cell;
      this.SelectPlugin._endCell = cell;

      this._this.render();
    }
    return;
  }

  private handleDBClick() {
    const dbClickCB = (e: any, cell: SelectedCellType) => {
      this.initEditBoxDom(cell, {
        isDBClick: true,
      });
    };
    this._this.setEvent(EventConstant.DB_CLICK, {
      type: EventZIndex.TABLE_CELLS,
      judgeFunc: (e) => {
        if (this.commonJudgeFunc(e)) {
          return false;
        }

        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }

        if (
          this.SelectPlugin._startCell &&
          this.SelectPlugin._endCell &&
          this.SelectPlugin._startCell.row !== this.SelectPlugin._endCell.row &&
          this.SelectPlugin._startCell.column !== this.SelectPlugin._endCell.column
        ) {
          return false;
        }

        const { cell } = this._this.getCellByPoint([point[0], point[1]]);
        if (cell && cell.column !== -1 && cell.row !== -1) {
          return cell;
        }
        return false;
      },
      innerFunc: dbClickCB.bind(this),
    });
  }

  private handleMouseDown() {
    // 处理鼠标点击事件
    const handleMouseDownCursor = (e: MouseEvent, [type, point]: [string, [number, number]]) => {
      const cells = this.SelectPlugin.selectedCells;
      const { cell } = this._this.getCellByPoint(point);
      if (!cells || !cell) {
        return;
      }
      const { leftTopCell: leftTopCell, rightBottomCell: rightBottomCell } = cells;

      // 下面是为了收敛选中的cell的，保证是框选内部的cell
      if (cell.column < leftTopCell.column) {
        cell.column = leftTopCell.column;
      }
      if (cell.column > rightBottomCell.column) {
        cell.column = rightBottomCell.column;
      }

      if (cell.row < leftTopCell.row) {
        cell.row = leftTopCell.row;
      }
      if (cell.row > rightBottomCell.row) {
        cell.row = rightBottomCell.row;
      }

      this.pointDownCell = cell;

      // cell 代表边框， 说明是剪切操作
      if (type === 'cell') {
        this.removeDom();
        this.startCopyCell = {
          leftTopCell: leftTopCell,
          rightBottomCell: rightBottomCell,
        };
      } else if (type === 'grab') {
        this.removeDom();
        this.startRegularCell = {
          leftTopCell: leftTopCell,
          rightBottomCell: rightBottomCell,
        };
      }
    };

    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return this.commonJudgeFunc(e);
      },
      innerFunc: handleMouseDownCursor.bind(this),
    });
  }
  private handleMouseMove() {
    // 处理鼠标悬浮改变样式的。  边框和右下角
    const handleOverCursor = (e: MouseEvent, [type, point]: [string, [number, number]]) => {
      if (type === 'grab') {
        if (this._this.canvasDom) {
          this._this.canvasDom.style.cursor = 'cell';
        }
      } else if (type === 'cell') {
        if (this._this.canvasDom) {
          this._this.canvasDom.style.cursor = 'grab';
        }
      }
    };

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return this.commonJudgeFunc(e);
      },
      innerFunc: handleOverCursor.bind(this),
      outerFunc: () => {
        if (this._this.canvasDom) {
          this._this.canvasDom.style.cursor = 'default';
        }
      },
    });

    // 下面的是用来拖拽到边框自动移动的
    const handleMouseMoveCB = (e: MouseEvent) => {
      const point = this._this.transformXYInContainer(e, true);
      if (!point) {
        return;
      }

      const { cell } = this._this.getCellByPoint(point);

      if (!cell) {
        return;
      }

      this.currentCell = cell;
      this._this.getPlugin(PluginTypeEnum.CornerAutoMove)?.start();
      this._this.render();
    };
    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        if (this.startCopyCell || this.startRegularCell) {
          return true;
        }
        return false;
      },
      innerFunc: handleMouseMoveCB.bind(this),
    });
  }
  private handleMouseUp() {
    // 处理鼠标点击事件
    const handleMouseUp = () => {
      if (this.startCopyCell) {
        this.handleCopyCB();
      }
      if (this.startRegularCell) {
        this.handleRegularCB();
      }
      this.startCopyCell = null;
      this.pointDownCell = null;
      this.startRegularCell = null;
      this.endRegularCell = null;
      this.currentCell = null;
      this._this.render();
    };

    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        if (!(this.startCopyCell || this.startRegularCell)) {
          return false;
        }
        return true;
      },
      innerFunc: handleMouseUp.bind(this),
    });
  }

  // 移动行和列
  private handleMoveRowsColumns() {
    const commonJudgeFunc = (e: MouseEvent) => {
      const point = this._this.transformXYInContainer(e);
      if (!point || !this.SelectPlugin._borderPosition) {
        return false;
      }
      const { anchor, w, h } = this.SelectPlugin._borderPosition;
      if (this.SelectPlugin.selectType === selectTypeEnum.column) {
        if (judgeOver(point, [anchor[0], 0, w, this._this.paddingTop])) {
          return {
            isRow: false,
            point,
          };
        }
      } else if (this.SelectPlugin.selectType === selectTypeEnum.row) {
        if (judgeOver(point, [0, anchor[1], this._this.paddingLeft, h])) {
          return {
            isRow: true,
            point,
          };
        }
      }
      return false;
    };
    const handleOverCursor = (
      e: MouseEvent,
      prop: {
        isRow: boolean;
        point: [number, number];
      },
    ) => {
      if (this._this.canvasDom) {
        this._this.canvasDom.style.cursor = 'grab';
      }
    };

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return commonJudgeFunc(e);
      },
      innerFunc: handleOverCursor,
      outerFunc: () => {
        if (this._this.canvasDom) {
          this._this.canvasDom.style.cursor = 'default';
        }
      },
    });

    const handleMouseDownCB = (e: MouseEvent, { isRow }: { isRow: boolean }) => {
      if (!this.SelectPlugin.selectedCells) {
        return;
      }

      const { leftTopCell, rightBottomCell } = this.SelectPlugin.selectedCells;
      if (isRow) {
        this.startMoveCells = {
          isRow,
          index: leftTopCell.row,
          length: rightBottomCell.row - leftTopCell.row + 1,
        };
      } else {
        this.startMoveCells = {
          isRow,
          index: leftTopCell.column,
          length: rightBottomCell.column - leftTopCell.column + 1,
        };
      }
    };
    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return commonJudgeFunc(e);
      },
      innerFunc: handleMouseDownCB,
    });

    const handleMouseMoveCB = (e: MouseEvent) => {
      const point = this._this.transformXYInContainer(e);
      if (!point) {
        return;
      }
      let latestIndex = 0;
      let min = Infinity;
      if (this.startMoveCells?.isRow) {
        this._this.renderCellsArr.forEach((cells) => {
          const cell = cells[0];
          const temp = Math.abs(cell.point[1] - point[1]);
          if (temp < min) {
            latestIndex = cell.location.row;
            min = temp;
          }
        });
      } else {
        this._this.renderCellsArr[0].forEach((cell) => {
          const temp = Math.abs(cell.point[0] - point[0]);
          if (temp < min) {
            latestIndex = cell.location.column;
            min = temp;
          }
        });
      }

      this.latestRowsColumns = latestIndex;
      this._this.getPlugin(PluginTypeEnum.CornerAutoMove)?.start();
      this._this.render();
    };
    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        if (this.startMoveCells) {
          return true;
        }
        return false;
      },
      innerFunc: handleMouseMoveCB,
    });

    const handleMouseUpCB = () => {
      if (!this.startMoveCells) {
        return;
      }
      const { isRow, index: originIndex, length } = this.startMoveCells;
      const selectedCells = this._this.getPlugin(PluginTypeEnum.SelectPowerPlugin)?.getSelectCellsScope();
      if (!selectedCells || !this.latestRowsColumns) {
        return;
      }

      if (Object.keys(this._this.getSpanCellsByRowColumns(true, this.latestRowsColumns)).length > 0) {
        this.startMoveCells = null;
        this.latestRowsColumns = null;
        this._this.emit(BusinessEventConstant.MSG_BOX, {
          type: 'warning',
          message: '无法拖拽，拖拽的目标区域有合并的单元格',
        });
        return;
      }

      const excel = this._this.getDataByScope(selectedCells)?.data;

      this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.addRemoveRowsColumns([
        {
          isAdd: false,
          isRow,
          index: originIndex,
          excel,
        },
        {
          isAdd: true,
          isRow,
          index: (this.latestRowsColumns -= originIndex < this.latestRowsColumns ? 1 : 0),
          excel,
        },
      ]);

      this.startMoveCells = null;
      this.latestRowsColumns = null;
    };
    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        if (this.startMoveCells) {
          return true;
        }
        return false;
      },
      innerFunc: handleMouseUpCB,
    });
  }

  private createEditBox(cell: SelectedCellType, [x, y, w, h]: RectType, needFocus = true) {
    if (this.editDomInstance) {
      return;
    }
    const originData = this._this.getRealCell(cell);
    if (!originData) {
      return;
    }
    this.editDomInstance = new InputDom(this._this, originData, cell, {
      needFocus,
    });
    // 需要微调是为了不遮挡
    this.editDomInstance.resetEditDomPosition(x, y, w, h);
    return this.editDomInstance;
  }

  public removeDom() {
    if (this.editDomInstance) {
      this.editDomInstance.remove();
      this.editDomInstance = null;
      this._this.render();
    }
  }

  public setContent(data: string[][], point: SelectedCellType) {
    const w = data[0].length;
    const h = data.length;
    const scope = {
      leftTopCell: point,
      rightBottomCell: {
        row: point.row + h - 1,
        column: point.column + w - 1,
      },
    };

    const spanCell = this._this.getSpanCellByCell({
      cellScope: {
        leftTopCell: scope.leftTopCell,
        rightBottomCell: scope.rightBottomCell,
      },
    });
    if (spanCell.isSpan) {
      return;
    }

    const sourceData = this._this.getDataByScope(scope);

    const targetData = deepClone(sourceData);
    data.forEach((row, r) => {
      row.forEach((content, c) => {
        targetData.data.cells[r][c].content = content;
      });
    });

    this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.cellsChange({
      scope: scope,
      pre_data: sourceData.data,
      after_data: targetData.data,
    });
  }

  private getCurrentScopeInCopy() {
    if (!this.startCopyCell) {
      return null;
    }
    const { leftTopCell: leftTopCell, rightBottomCell: rightBottomCell } = deepClone(this.startCopyCell);
    if (this.currentCell && this.pointDownCell) {
      let columnGap = this.currentCell.column - this.pointDownCell.column;
      let rowGap = this.currentCell.row - this.pointDownCell.row;

      columnGap = Math.max(columnGap, -leftTopCell.column);
      rowGap = Math.max(rowGap, -leftTopCell.row);

      columnGap = Math.min(columnGap, this._this._data.w.length - rightBottomCell.column);
      rowGap = Math.min(rowGap, this._this._data.h.length - 1 - rightBottomCell.row);

      leftTopCell.column += columnGap;
      leftTopCell.row += rowGap;
      rightBottomCell.column += columnGap;
      rightBottomCell.row += rowGap;
      return { leftTopCell, rightBottomCell } as CellCornerScopeType;
    }
    return { leftTopCell, rightBottomCell } as CellCornerScopeType;
  }

  public combineCells() {
    const selectCells = this.SelectPlugin.getSelectCellsScope();
    if (!selectCells) {
      // 没有选中单元格，
      this._this.devMode && console.log('合并单元格：需要先选中单元格');
      return;
    }
    if (selectCells.rightBottomCell.column - selectCells.leftTopCell.column === 0 && selectCells.rightBottomCell.row - selectCells.leftTopCell.row === 0) {
      // 只选中了一个单元格，
      this._this.devMode && console.log('合并单元格：不能只选中一个单元格');
      return;
    }

    const originSpanCell = this._this.getSpanCell(selectCells.leftTopCell);
    const sourceData = this._this.getDataByScope(selectCells);

    if (
      originSpanCell &&
      originSpanCell.span[0] === selectCells.rightBottomCell.column - selectCells.leftTopCell.column + 1 &&
      originSpanCell.span[1] === selectCells.rightBottomCell.row - selectCells.leftTopCell.row + 1
    ) {
      // 取消合并
      const originSpanCell = deepClone(this._this.data.spanCells[selectCells.leftTopCell.row + '_' + selectCells.leftTopCell.column]);
      // @ts-ignore
      delete originSpanCell.span;

      const targetData = deepClone(sourceData);
      targetData.data.cells = targetData.data.cells.map((row) => {
        return row.map(() => {
          return createDefaultCell();
        });
      });
      targetData.data.cells[0][0] = originSpanCell;

      delete targetData.data.spanCells[selectCells.leftTopCell.row + '_' + selectCells.leftTopCell.column];

      this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.cellsChange({
        scope: selectCells,
        pre_data: sourceData.data,
        after_data: targetData.data,
      });

      // 用来计算toolBar的按钮状态的
      this._this.ToolBar?.emit(ToolsEventConstant.REFRESH_ATTRIBUTES_STATE);
      return;
    }

    if (Object.values(sourceData.data.spanCells).length > 0) {
      // 有别的合并单元格，阻止合并
      this._this.emit(BusinessEventConstant.MSG_BOX, {
        type: 'warning',
        message: '无法合并，合并的目标区域有合并的单元格',
      });
      return;
    }

    // 可以合并
    const newSpanCell: SpanCell = Object.assign(deepClone(sourceData.data.cells[0][0]), {
      span: [selectCells.rightBottomCell.column - selectCells.leftTopCell.column + 1, selectCells.rightBottomCell.row - selectCells.leftTopCell.row + 1],
    } as {
      span: [number, number];
    });
    const targetData = deepClone(sourceData);
    targetData.data.cells = targetData.data.cells.map((row) => {
      return row.map(() => {
        return createDefaultCell();
      });
    });
    targetData.data.spanCells[selectCells.leftTopCell.row + '_' + selectCells.leftTopCell.column] = newSpanCell;

    this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction)?.cellsChange({
      scope: selectCells,
      pre_data: sourceData.data,
      after_data: targetData.data,
    });

    // 用来计算toolBar的按钮状态的
    this._this.ToolBar?.emit(ToolsEventConstant.REFRESH_ATTRIBUTES_STATE);
  }

  private handleCopyCB() {
    if (!this.startCopyCell) {
      return;
    }

    const sourceCells: CellCornerScopeType = deepClone(this.startCopyCell);
    const targetCells = this.getCurrentScopeInCopy();

    if (!targetCells) {
      return;
    }

    const exceptSpanCells = this._this.getSpanCellByCell({
      cellScope: sourceCells,
      isInView: false,
    }).cells;

    if (
      this._this.judgeCellsCrossSpanCell({
        cellScope: {
          leftTopCell: targetCells.leftTopCell,
          rightBottomCell: targetCells.rightBottomCell,
        },
        except: exceptSpanCells.map((span) => span.column + '_' + span.row),
        isInView: false,
      })
    ) {
      this._this.emit(BusinessEventConstant.MSG_BOX, {
        type: 'warning',
        message: '无法拖拽，拖拽的目标区域有合并的单元格',
      });
      this._this.devMode && console.log('spancell');
      return;
    }

    const SourceData = this._this.getDataByScope({
      leftTopCell: sourceCells.leftTopCell,
      rightBottomCell: sourceCells.rightBottomCell,
    });

    // 生成sourceData处的空数据
    const SourceAfterCells: Cell[][] = [];
    for (let row = sourceCells.leftTopCell.row; row <= sourceCells.rightBottomCell.row; row++) {
      const temp: Cell[] = [];
      for (let column = sourceCells.leftTopCell.column; column <= sourceCells.rightBottomCell.column; column++) {
        temp.push(createDefaultCell(''));
      }
      SourceAfterCells.push(temp);
    }

    // 如果有新的 生成spanCell。
    const tempMap: Record<string, SpanCell> = {};
    const SourcePreSpanCells = deepClone(SourceData.data.spanCells);
    Object.keys(SourceData.data.spanCells).forEach((key) => {
      const newKey = key.split('_').map(Number);
      newKey[0] += targetCells.leftTopCell.row - SourceData.scope.leftTopCell.row;
      newKey[1] += targetCells.leftTopCell.column - SourceData.scope.leftTopCell.column;
      tempMap[newKey.join('_')] = SourceData.data.spanCells[key];
    });
    SourceData.data.spanCells = tempMap;

    const targetCellsPreData = this._this.getDataByScope(targetCells);

    this.ExcelBaseFunction.cellsMove({
      pre_data: {
        scope: {
          leftTopCell: sourceCells.leftTopCell,
          rightBottomCell: sourceCells.rightBottomCell,
        },
        pre_data: {
          ...SourceData.data,
          spanCells: SourcePreSpanCells,
        },
        after_data: {
          cells: SourceAfterCells,
          w: SourceData.data.w,
          h: SourceData.data.h,
          spanCells: {},
        },
      },
      after_data: {
        scope: targetCells,
        pre_data: targetCellsPreData.data,
        after_data: SourceData.data,
      },
      time_stamp: new Date(),
    });

    this.SelectPlugin.selectCells(targetCells);
  }
  private handleRegularCB() {
    this._this.devMode && console.log('handleRegularCB');
    if (!this.SelectPlugin._startCell || !this.SelectPlugin._endCell || !this.endRegularCell) {
      return;
    }

    if (
      this._this.judgeCellsCrossSpanCell({
        cellScope: {
          leftTopCell: this.endRegularCell.leftTopCell,
          rightBottomCell: this.endRegularCell.rightBottomCell,
        },
        isInView: false,
      })
    ) {
      this._this.emit(BusinessEventConstant.MSG_BOX, {
        type: 'warning',
        message: '目标区域包含合并单元格，可取消合并单元格后重试。',
      });
      this._this.devMode && console.log('spancell');
      return;
    }

    const sourceData = this._this.getDataByScope({
      leftTopCell: this.SelectPlugin._startCell,
      rightBottomCell: this.SelectPlugin._endCell,
    });

    const result = handleRegularData({
      arrow: this.regularArrow,
      sourceData,
      scope: this.endRegularCell,
    });

    const preData = this._this.getDataByScope({
      leftTopCell: this.endRegularCell.leftTopCell,
      rightBottomCell: this.endRegularCell.rightBottomCell,
    });
    this.ExcelBaseFunction.cellsChange({
      scope: {
        leftTopCell: this.endRegularCell.leftTopCell,
        rightBottomCell: this.endRegularCell.rightBottomCell,
      },
      pre_data: preData.data,
      after_data: result,
    });
  }
}
