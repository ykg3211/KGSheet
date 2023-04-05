import { EventConstant } from '../plugins/base/event';
import Render from './render';
import Plugins, { PluginType, PluginTypeEnum } from '../plugins';
import { dispatchEventType, setEventType, clearEventType } from '../plugins/base/EventDispatch';
import { deepClone, judgeCross, judgeOver } from '../../utils';
import { ColorType, RectType } from './drawLayer';
import { CellCornerScopeType } from '../plugins/SelectAndInput/EditCellPlugin';
import { ExcelConfig, BaseSheetSetting, SpanCell, RenderCellProps } from '../../interfaces';
import ToolBar from '../../toolBar';
import BottomBar from '../../bottomBar';

export interface BaseDataType {
  scope: CellCornerScopeType;
  data: ExcelConfig;
}

export interface SelectedCellType {
  row: number;
  column: number;
}
class Base extends Render {
  public ToolBar: ToolBar | null;
  public BottomBar: BottomBar | null;
  public pluginsInstance!: Plugins;
  public setEvent!: setEventType;
  public clearEvent!: clearEventType;
  public dispatchEvent!: dispatchEventType;
  public pluginsMap: PluginType;

  private originOverflowY: any;
  private originOverflowX: any;

  constructor(config: BaseSheetSetting) {
    super(config);
    this.ToolBar = null;
    this.BottomBar = null;
    this.pluginsMap = {};
    if (!this.wrapperDom) {
      console.error('必须要指定一个DOM！');
      return;
    }
    this.wrapperDom = this.wrapperDom;
    this.canvasDom = document.createElement('canvas');
    this.ctx = this.canvasDom.getContext('2d') as CanvasRenderingContext2D;
    this.initResize(this.wrapperDom);

    setTimeout(() => {
      this.handleDPR(this.wrapperDom);
      this.render();
    }, 0);

    this.pluginsInstance = new Plugins(this);

    this.wrapperDom.appendChild(this.canvasDom);

    this.initDarkMode();

    this.handleOverflow();
    this.disableLeftBack();
  }

  /**
   * deregister
   */
  public deregister() {
    this.pluginsInstance.deregister();
  }

  private handleOverflow() {
    this.originOverflowY = document.body.style.overflowY;
    this.originOverflowX = document.body.style.overflowX;
    document.body.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
    this.on(EventConstant.DESTROY, () => {
      document.body.style.overflowY = this.originOverflowY;
      document.body.style.overflowX = this.originOverflowX;
    });
  }

  private initDarkMode() {
    if (this.canvasDom) {
      this.canvasDom.style.backgroundColor = this.getColor(ColorType.white);
    }
    this.on(EventConstant.DARK_MODE_CHANGE, () => {
      if (this.canvasDom) {
        this.canvasDom.style.backgroundColor = this.getColor(ColorType.white);
      }
    });
  }

  public getPlugin<T extends PluginTypeEnum>(name: T): PluginType[T] {
    return this.pluginsMap[name];
  }

  /**
   * 初始化resize
   */
  private initResize(dom: HTMLElement) {
    const func = () => {
      this.emit(EventConstant.RESIZE, {
        width: dom.offsetWidth,
        height: dom.offsetHeight,
      });
      this.handleDPR(dom);
      this.render();
    };
    window.addEventListener('resize', func);
    this.once(EventConstant.DESTROY, () => {
      window.removeEventListener('resize', func);
    });
  }

  /**
   * 禁用左滑返回
   */
  private disableLeftBack() {}

  // 计算边框
  public calBorder(startCell: SelectedCellType, endCell: SelectedCellType) {
    const { _data, paddingLeft, paddingTop, scrollLeft, scrollTop } = this;

    startCell.column = Math.max(0, startCell.column);
    startCell.row = Math.max(0, startCell.row);
    endCell.column = Math.max(0, endCell.column);
    endCell.row = Math.max(0, endCell.row);

    const cellPosition: RectType = [
      _data.w.slice(0, startCell.column).reduce((a, b) => a + b, 0) + paddingLeft - scrollLeft,
      _data.h.slice(0, startCell.row).reduce((a, b) => a + b, 0) + paddingTop - scrollTop,
      _data.w.slice(startCell.column, endCell.column + 1).reduce((a, b) => a + b, 0),
      _data.h.slice(startCell.row, endCell.row + 1).reduce((a, b) => a + b, 0),
    ];

    return cellPosition;
  }

  /**
   * transformInContainer
   * 将screen的xy坐标转化成在容器中的坐标
   */
  public transformXYInContainer(e: MouseEvent, alwayInner = false /** 如果点在外面则平移到视图内部 */) {
    if (!this.canvasDom) {
      return false;
    }
    const result = [e.pageX - this.canvasDom.offsetLeft, e.pageY - this.canvasDom.offsetTop];
    if (result[0] > 0 && result[1] > 0 && result[0] < this._width && result[1] < this._height) {
      return result.map((item) => item / this.scale) as [number, number];
    }

    if (alwayInner) {
      result[0] = Math.max(0, result[0]);
      result[1] = Math.max(0, result[1]);

      result[0] = Math.min(this._width, result[0]);
      result[1] = Math.min(this._height, result[1]);
      return result.map((item) => item / this.scale) as [number, number];
    }

    return false;
  }

  /**
   * 判断cell来是不是一个spanCell内部的，并且返回spanCell
   * 默认是在当前视图内的。
   */
  public getSpanCellByCell({
    cell,
    cellScope,
    isInView = true,
  }: {
    cell?: SelectedCellType | null;
    cellScope?: CellCornerScopeType;
    isInView?: boolean;
  }) {
    cellScope = deepClone(cellScope);
    if (!cell && !cellScope) {
      return {
        isSpan: false,
        cells: cell ? [cell] : [],
      };
    }
    let w = 1;
    let h = 1;
    if (!cell && cellScope) {
      cell = cellScope.leftTopCell;
      w = cellScope.rightBottomCell.column - cellScope.leftTopCell.column + 1;
      h = cellScope.rightBottomCell.row - cellScope.leftTopCell.row + 1;
    }
    let source: Array<
      SpanCell & {
        location: SelectedCellType;
      }
    > = [];
    if (isInView) {
      // @ts-ignore
      source = this.renderSpanCellsArr.map((spanCell) => ({
        location: spanCell.location,
        ...spanCell.cell,
      }));
    } else {
      Object.keys(this._data.spanCells).forEach((key) => {
        const [x, y] = key.split('_').map(Number);
        source.push({
          location: {
            row: x,
            column: y,
          },
          ...this._data.spanCells[key],
        });
      });
    }
    let isSpan = false;
    let result: SelectedCellType[] = [];
    source.forEach((c) => {
      if (
        judgeCross(
          [c.location.column, c.location.row, c.span[0], c.span[1]],
          [(cell as SelectedCellType).column, (cell as SelectedCellType).row, w, h],
        )
      ) {
        isSpan = true;
        result.push({
          row: c.location.row,
          column: c.location.column,
        });
      }
    });

    return {
      isSpan,
      cells: result,
    };
  }

  public judgeCellsCrossSpanCell({
    cellScope,
    isInView = true,
    except,
  }: {
    cellScope: CellCornerScopeType;
    isInView?: boolean;
    except?: string[];
  }) {
    let source: (SpanCell & {
      location: SelectedCellType;
    })[] = [];
    if (isInView) {
      // @ts-ignore
      source = this.renderSpanCellsArr.map((spanCell) => ({
        location: spanCell.location,
        ...spanCell.cell,
      }));
    } else {
      Object.keys(this._data.spanCells).forEach((key) => {
        const [x, y] = key.split('_').map(Number);
        source.push({
          location: {
            row: x,
            column: y,
          },
          ...this._data.spanCells[key],
        });
      });
    }

    source = source.filter((spanCell) => {
      return !(except || []).includes(spanCell.location.column + '_' + spanCell.location.row);
    });

    let isCross = false;
    source.some((spanCell) => {
      if (
        judgeCross(
          [spanCell.location.column, spanCell.location.row, spanCell.span[0], spanCell.span[1]],
          [
            cellScope.leftTopCell.column,
            cellScope.leftTopCell.row,
            cellScope.rightBottomCell.column - cellScope.leftTopCell.column + 1,
            cellScope.rightBottomCell.row - cellScope.leftTopCell.row + 1,
          ],
        )
      ) {
        isCross = true;
        return true;
      }
      return false;
    });
    return isCross;
  }

  /**
   * getCellByPoint
   * 通过相对于视图的坐标获取当前点击的单元格
   */
  public getCellByPoint(point: [number, number]) {
    const { renderCellsArr, renderSpanCellsArr } = this;

    let selectedCell: SelectedCellType | null = null;
    let selectedCellLocation: RenderCellProps | null = null;
    // 点击最左上角的
    if (point[0] <= this.paddingLeft && point[1] <= this.paddingTop) {
      selectedCell = {
        row: -1,
        column: -1,
      };
    } else if (point[0] <= this.paddingLeft) {
      // 计算选中的左侧bar
      renderCellsArr
        .map((row) => row[0])
        .some((cell) => {
          if (judgeOver(point, [0, cell.point[1], this.width, cell.h])) {
            selectedCell = {
              row: cell.location.row,
              column: -1,
            };
            return true;
          }
          return false;
        });
    } else if (point[1] <= this.paddingTop) {
      // 计算选中的上方bar
      renderCellsArr[0].some((cell) => {
        if (judgeOver(point, [cell.point[0], 0, cell.w, this.height])) {
          selectedCell = {
            row: -1,
            column: cell.location.column,
          };
          return true;
        }
        return false;
      });
    } else {
      renderCellsArr.some((row) => {
        if (row.length > 0) {
          if (point[1] >= row[0].point[1] && point[1] < row[0].point[1] + row[0].h) {
            row.some((cell) => {
              if (judgeOver(point, [cell.point[0], cell.point[1], cell.w, cell.h])) {
                selectedCell = {
                  row: cell.location.row,
                  column: cell.location.column,
                };
                selectedCellLocation = cell;
                return true;
              }
              return false;
            });
            return true;
          }
        }
        return false;
      });
    }
    return {
      cell: selectedCell,
      cellLoaction: selectedCellLocation,
    } as {
      cell: SelectedCellType | null;
      cellLoaction: RenderCellProps | null;
    };
  }

  /**
   * getRectByCell
   */
  public getRectByCell(cell: SelectedCellType) {
    const { _data, paddingLeft, scrollTop, scrollLeft, paddingTop } = this;

    const startCell = {
      row: cell.row,
      column: cell.column,
    };
    const endCell = {
      row: cell.row,
      column: cell.column,
    };
    const spanCell = this.getSpanCell(cell);
    if (this._data.spanCells && spanCell) {
      endCell.row += spanCell.span[1] - 1;
      endCell.column += spanCell.span[0] - 1;
    }
    return [
      _data.w.slice(0, startCell.column).reduce((a, b) => a + b, 0) + paddingLeft - scrollLeft,
      _data.h.slice(0, startCell.row).reduce((a, b) => a + b, 0) + paddingTop - scrollTop,
      _data.w.slice(startCell.column, endCell.column + 1).reduce((a, b) => a + b, 0),
      _data.h.slice(startCell.row, endCell.row + 1).reduce((a, b) => a + b, 0),
    ] as RectType;
  }

  /**
   * getRealCell
   */
  public getRealCell(cell: SelectedCellType) {
    const spanCell = this.getSpanCell(cell);
    if (this._data.spanCells && spanCell) {
      return spanCell;
    }
    return this._data.cells?.[cell.row]?.[cell.column] || null;
  }

  /**
   * getDataByScope
   */
  public getDataByScope({ leftTopCell: _leftTopCell, rightBottomCell: _rightBottomCell }: CellCornerScopeType) {
    _leftTopCell = deepClone(_leftTopCell);
    _rightBottomCell = deepClone(_rightBottomCell);

    let leftTopCell: SelectedCellType = {
      row: Math.min(_leftTopCell.row, _rightBottomCell.row),
      column: Math.min(_leftTopCell.column, _rightBottomCell.column),
    };
    let rightBottomCell: SelectedCellType = {
      row: Math.max(_leftTopCell.row, _rightBottomCell.row),
      column: Math.max(_leftTopCell.column, _rightBottomCell.column),
    };

    const cells = this._data.cells.slice(leftTopCell.row, rightBottomCell.row + 1).map((row) => {
      return row.slice(leftTopCell.column, rightBottomCell.column + 1);
    });

    const spanCells: Record<string, SpanCell> = {};

    Object.keys(this._data.spanCells).forEach((key) => {
      const [row, column] = key.split('_').map(Number);
      const spanCell = this._data.spanCells[key];
      if (
        judgeCross(
          [column, row, spanCell.span[0], spanCell.span[1]],
          [
            leftTopCell.column,
            leftTopCell.row,
            rightBottomCell.column - leftTopCell.column + 1,
            rightBottomCell.row - leftTopCell.row + 1,
          ],
        )
      ) {
        spanCells[key] = this._data.spanCells[key];
      }
    });

    let result: ExcelConfig = {
      w: this._data.w.slice(leftTopCell.column, rightBottomCell.column + 1),
      h: this._data.h.slice(leftTopCell.row, rightBottomCell.row + 1),
      cells,
      spanCells,
    };

    result = deepClone(result);

    return {
      scope: {
        leftTopCell,
        rightBottomCell,
      },
      data: result,
    } as BaseDataType;
  }

  /**
   * _setDataByScope
   * 这是真正的用来设置单元格内内容的方法
   */
  public setDataByScope(SourceData: BaseDataType) {
    if (!SourceData) {
      return;
    }
    const { scope, data } = SourceData;
    const { leftTopCell, rightBottomCell } = scope;
    for (let row = leftTopCell.row; row <= rightBottomCell.row; row++) {
      for (let column = leftTopCell.column; column <= rightBottomCell.column; column++) {
        this._data.cells[row][column] = data.cells[row - leftTopCell.row][column - leftTopCell.column];
        this._data.cells[row][column] = data.cells[row - leftTopCell.row][column - leftTopCell.column];
        // 用来撑大单元格的
        if (row === leftTopCell.row) {
          this._data.w[column] = data.w[column - leftTopCell.column];
        }
      }
      // 用来撑大单元格的
      this._data.h[row] = data.h[row - leftTopCell.row];
    }

    this._data.spanCells = {
      ...this._data.spanCells,
      ...SourceData.data.spanCells,
    };
    this.render();
  }

  /**
   * getSpanCell
   */
  public getSpanCell(cell: SelectedCellType) {
    return this._data.spanCells[cell.row + '_' + cell.column] as SpanCell | undefined;
  }
}

export default Base;
