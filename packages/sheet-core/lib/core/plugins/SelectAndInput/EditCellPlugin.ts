// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示
import { PluginTypeEnum } from '..';
import Base, { BaseDataType, selectedCellType } from '../../base/base';
import { EventZIndex, RenderZIndex } from '../../base/constant';
import { rectType } from '../../base/drawLayer';
import { cell, spanCell } from '../../../interfaces';
import { combineCell, debounce, deepClone, judgeCross, judgeOver } from '../../../utils';
import { createDefaultCell } from '../../../utils/defaultData';
import { EventConstant } from '../base/event';
import ExcelBaseFunction from '../EventStack';
import KeyBoardPlugin from '../KeyBoardPlugin';
import { BASE_KEYS_ENUM, CONTENT_KEYS, OPERATE_KEYS_ENUM } from '../KeyBoardPlugin/constant';
import SelectPowerPlugin, { selectTypeEnum } from './SelectPowerPlugin';
import { BusinessEventConstant } from '../base/businessEvent';
import { InputDom } from './InputDom';
import { handleRegularData, regularArrowEnum } from './regularFunc';

export interface CellScopeType {
  startCell: selectedCellType;
  endCell: selectedCellType;
}

export interface CellCornerScopeType {
  leftTopCell: selectedCellType;
  rightBottomCell: selectedCellType;
}

export default class EditCellPlugin {
  public name: string;
  private _this: Base;
  private KeyboardPlugin!: KeyBoardPlugin;
  private SelectPlugin!: SelectPowerPlugin;
  private ExcelBaseFunction!: ExcelBaseFunction;
  private editDomInstance!: null | InputDom;
  private editCell!: null | selectedCellType;

  private pointDownCell!: null | selectedCellType; // 剪切单元格专用的，记录鼠标点下去的时候的cell位置。
  private startCopyCell!: null | CellScopeType; // 这个是用户拖拽单元格边框的标志， 用处是剪切单元格。

  private startRegularCell!: null | CellScopeType; // 这个是用户拖拽单元格右下角开始的标志， 用处就是有规则的扩展单元格
  private endRegularCell!: null | CellScopeType; // 这个是用户拖拽单元格右下角开始的标志， 用处就是有规则的扩展单元格
  private currentCell!: null | selectedCellType; // 拖拽的时候鼠标的落点，用于计算的
  private regularArrow!: regularArrowEnum; // 拖拽的时候鼠标的落点，用于计算的
  constructor(_this: Base) {
    this.name = PluginTypeEnum.CommonInputPowerPlugin;
    this._this = _this;

    this.initPlugin();
    this.registerKeyboardEvent();

    this.initEvent();
    this.addRenderFunc();
    this.transformEditDom();
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

  private registerKeyboardEvent() {
    const KetBoardPlugin = this._this.getPlugin(PluginTypeEnum.KeyBoardPlugin);
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
          const nextCell = this.SelectPlugin.getNextCellByMove(
            mirror,
            isLeft ? OPERATE_KEYS_ENUM.ArrowLeft : OPERATE_KEYS_ENUM.ArrowRight,
          );

          this.SelectPlugin._startCell = deepClone(nextCell);
          this.SelectPlugin._endCell = deepClone(nextCell);
          this.SelectPlugin.selectCell = nextCell;
          this._this.render();
          this.SelectPlugin.moveToView();
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
          const nextCell = this.SelectPlugin.getNextCellByMove(
            mirror,
            isUp ? OPERATE_KEYS_ENUM.ArrowUp : OPERATE_KEYS_ENUM.ArrowDown,
          );

          this.SelectPlugin._startCell = deepClone(nextCell);
          this.SelectPlugin._endCell = deepClone(nextCell);
          this.SelectPlugin.selectCell = nextCell;
          this._this.render();
          this.SelectPlugin.moveToView();
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
        mainKeys: Object.keys(CONTENT_KEYS),
        callbacks: [
          (e, v) => {
            if (!this.SelectPlugin.selectCell) {
              return;
            }
            if (this.SelectPlugin.selectCell.row < 0 || this.SelectPlugin.selectCell.column < 0) {
              return;
            }
            this.initEditBoxDom(this.SelectPlugin.selectCell);
            if (this.editDomInstance) {
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
            this.clearScopeContent({
              leftTopCell: border.cellScope.startCell,
              rightBottomCell: border.cellScope.endCell,
            });
          },
        ],
      });
    }
  }

  // 增加delete方法，清空content；
  private clearScopeContent(scope: CellCornerScopeType) {
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
          const { startCell, endCell } = this.startRegularCell;
          const { currentCell } = this;
          const centerTag = {
            column: (startCell.column + endCell.column) / 2,
            row: (startCell.row + endCell.row) / 2,
          };
          const columnGap = Math.max(
            Math.abs(currentCell.column - centerTag.column) - Math.abs(startCell.column + endCell.column) / 2,
            0,
          );
          const rowGap = Math.max(
            Math.abs(currentCell.row - centerTag.row) - Math.abs(startCell.row - endCell.row) / 2,
            0,
          );

          if (columnGap >= rowGap) {
            this.regularArrow =
              currentCell.column > centerTag.column ? regularArrowEnum.LEFT2RIGHT : regularArrowEnum.RIGHT2LEFT;
            currentCell.row = endCell.row;
          } else {
            this.regularArrow =
              currentCell.row > centerTag.row ? regularArrowEnum.TOP2BOTTOM : regularArrowEnum.BOTTOM2TOP;
            currentCell.column = endCell.column;
          }

          const { leftTopCell, rightBottomCell } = combineCell([startCell, endCell, currentCell]);
          this.endRegularCell = {
            startCell: leftTopCell,
            endCell: rightBottomCell,
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
  }

  private drawDashBorder(ctx: CanvasRenderingContext2D, rect: rectType) {
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
          const position = this._this.getRectByCell(this.editCell);

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

    // 判断选择一行或者一列的情况
    if (this.SelectPlugin.selectType === selectTypeEnum.column) {
      if (judgeOver(point, [anchor[0], 0, w, this._this.paddingTop])) {
        return ['cell', point];
      }
    } else if (this.SelectPlugin.selectType === selectTypeEnum.row) {
      if (judgeOver(point, [0, anchor[1], this._this.paddingLeft, h])) {
        return ['cell', point];
      }
    }

    // 判断是不是单元格内部
    if (
      judgeOver(point, [
        anchor[0] + strokeRectWidth / 2,
        anchor[1] + strokeRectWidth / 2,
        w - strokeRectWidth,
        h - strokeRectWidth,
      ])
    ) {
      return false;
    }
    // 判断是不是单元格外部
    if (
      !judgeOver(point, [
        anchor[0] - strokeRectWidth / 2,
        anchor[1] - strokeRectWidth / 2,
        w + strokeRectWidth,
        h + strokeRectWidth,
      ])
    ) {
      return false;
    }
    // 判断是不是右下角的小框
    if (
      judgeOver(point, [
        anchor[0] + w - strokeRectWidth / 2,
        anchor[1] + h - strokeRectWidth / 2,
        strokeRectWidth,
        strokeRectWidth,
      ])
    ) {
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
        if (this.editDomInstance && !(e as any).path.includes(this.editDomInstance)) {
          this.removeDom();
        }
        return false;
      },
      innerFunc: () => {},
    });

    this.handleMouseDown();
    this.handleDBClick();
    this.handleMouseMove();
    this.handleMouseUp();
  }

  private initEditBoxDom(cell: selectedCellType) {
    const { cell: realCell } = this._this.getSpanCellByCell({ cell });
    if (!realCell) {
      return;
    }
    if (this._this.canvasDom) {
      this.editCell = realCell;

      const position = this._this.getRectByCell(this.editCell);

      position[0] += this._this.canvasDom.offsetLeft;
      position[1] += this._this.canvasDom.offsetTop;

      this.createEditBox(this.editCell, position);

      this.SelectPlugin._selectCell = cell;
      this.SelectPlugin._endCell = cell;

      this._this.render();
      this.SelectPlugin.moveToView();
    }
    return;
  }

  private handleDBClick() {
    const dbClickCB = (e: any, cell: selectedCellType) => {
      this.initEditBoxDom(cell);
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

        const cell = this._this.getCellByPoint([point[0], point[1]]);
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
      const cells = this.SelectPlugin.cornerCells;
      const cell = this._this.getCellByPoint(point);
      if (!cells || !cell) {
        return;
      }
      const { startCell: leftTopCell, endCell: rightBottomCell } = cells;

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
          startCell: leftTopCell,
          endCell: rightBottomCell,
        };
      } else if (type === 'grab') {
        this.removeDom();
        this.startRegularCell = {
          startCell: leftTopCell,
          endCell: rightBottomCell,
        };
      }
    };

    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return this.commonJudgeFunc(e);
      },
      innerFunc: handleMouseDownCursor.bind(this),
      outerFunc: () => {
        document.body.style.cursor = 'default';
      },
    });
  }
  private handleMouseMove() {
    // 处理鼠标悬浮改变样式的。  边框和右下角
    const handleOverCursor = (e: MouseEvent, [type, point]: [string, [number, number]]) => {
      if (type === 'grab') {
        document.body.style.cursor = 'cell';
      } else if (type === 'cell') {
        document.body.style.cursor = 'grab';
      }
    };

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SELECT_TABLE_CELL,
      judgeFunc: (e) => {
        return this.commonJudgeFunc(e);
      },
      innerFunc: handleOverCursor.bind(this),
      outerFunc: () => {
        document.body.style.cursor = 'default';
      },
    });

    const handleMouseMoveCB = (e: MouseEvent) => {
      const point = this._this.transformXYInContainer(e, true);
      if (!point) {
        return;
      }

      const cell = this._this.getCellByPoint(point);

      if (!cell) {
        return;
      }

      this.currentCell = cell;
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

  private createEditBox(cell: selectedCellType, [x, y, w, h]: rectType) {
    if (this.editDomInstance) {
      return;
    }
    const originData = this._this.getRealCell(cell);
    this.editDomInstance = new InputDom(this._this, originData, cell);
    // 需要微调是为了不遮挡
    this.editDomInstance.resetEditDomPosition(x, y, w, h);
    return this.editDomInstance;
  }

  private removeDom() {
    if (this.editDomInstance) {
      this.editDomInstance.remove();
      this.editDomInstance = null;
      this._this.render();
    }
  }

  // private setCommonStyle(dom: HTMLElement, originData: cell) {
  // 	const cellStyle = originData.style;

  // 	dom.style.backgroundColor = cellStyle.backgroundColor
  // 		? cellStyle.backgroundColor
  // 		: this._this.color('white');
  // 	Object.keys(cellStyle).forEach((key) => {
  // 		dom.style[key] = cellStyle[key];
  // 	});
  // 	dom.style.font = cellStyle.font || '';
  // 	dom.style.fontSize = (cellStyle.fontSize || 12) * this._this.scale + 'px';
  // 	dom.style.textAlign = cellStyle.align || '';
  // 	dom.style.color = cellStyle.fontColor || this._this.color('black');
  // 	dom.style.position = 'absolute';
  // 	dom.style.top = '0px';
  // 	dom.style.left = '0px';
  // 	dom.style.outline = 'none';
  // 	dom.style.border = '1px solid #4a89fe';
  // 	dom.style.resize = 'none';
  // }

  private getCurrentScopeInCopy() {
    if (!this.startCopyCell) {
      return null;
    }
    const { startCell: leftTopCell, endCell: rightBottomCell } = deepClone(this.startCopyCell);
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

  private handleCopyCB() {
    if (!this.startCopyCell) {
      return;
    }

    const sourceCells: CellScopeType = deepClone(this.startCopyCell);
    const targetCells = this.getCurrentScopeInCopy();

    if (!targetCells) {
      return;
    }

    if (
      this._this.getSpanCellByCell({
        cellScope: {
          startCell: targetCells.leftTopCell,
          endCell: targetCells.rightBottomCell,
        },
        isInView: false,
      }).isSpan
    ) {
      this._this.emit(BusinessEventConstant.MSG_BOX, {
        type: 'warning',
        message: '123',
      });
      console.log('spancell');
      return;
    }

    const SourceData = this._this.getDataByScope({
      leftTopCell: sourceCells.startCell,
      rightBottomCell: sourceCells.endCell,
    });

    // 生成sourceData处的空数据
    const SourceAfterCells: cell[][] = [];
    for (let row = sourceCells.startCell.row; row <= sourceCells.endCell.row; row++) {
      const temp: cell[] = [];
      for (let column = sourceCells.startCell.column; column <= sourceCells.endCell.column; column++) {
        temp.push(createDefaultCell(''));
      }
      SourceAfterCells.push(temp);
    }

    // 如果有新的 生成spanCell。
    const tempMap: Record<string, spanCell> = {};
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
      sourceData: {
        scope: {
          leftTopCell: sourceCells.startCell,
          rightBottomCell: sourceCells.endCell,
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
      targetData: {
        scope: targetCells,
        pre_data: targetCellsPreData.data,
        after_data: SourceData.data,
      },
      time_stamp: new Date(),
    });

    this.SelectPlugin.selectCells(targetCells);
  }
  private handleRegularCB() {
    console.log('handleRegularCB');
    if (!this.SelectPlugin._startCell || !this.SelectPlugin._endCell || !this.endRegularCell) {
      return;
    }

    if (
      this._this.getSpanCellByCell({
        cellScope: {
          startCell: this.endRegularCell.startCell,
          endCell: this.endRegularCell.endCell,
        },
        isInView: false,
      }).isSpan
    ) {
      this._this.emit(BusinessEventConstant.MSG_BOX, {
        type: 'warning',
        message: '123',
      });
      console.log('spancell');
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
      leftTopCell: this.endRegularCell.startCell,
      rightBottomCell: this.endRegularCell.endCell,
    });
    this.ExcelBaseFunction.cellsChange({
      scope: {
        leftTopCell: this.endRegularCell.startCell,
        rightBottomCell: this.endRegularCell.endCell,
      },
      pre_data: preData.data,
      after_data: result,
    });
  }
}
