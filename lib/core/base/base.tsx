import { EventConstant } from "../../plugins/event";
import Render from "./render";
import Plugins from "../../plugins";
import { dispatchEventType, setEventType, clearEventType } from "../../plugins/EventStack";
import { judgeOver } from "../../utils";
import { rectType } from "./drawLayer";

export interface selectedCellType {
  row: number,
  column: number
}
class Base extends Render {
  protected pluginsInstance: Plugins;
  public setEvent: setEventType;
  public clearEvent: clearEventType;
  public dispatchEvent: dispatchEventType;

  constructor(dom: HTMLElement) {
    super();

    this.canvasDom = document.createElement('canvas');
    this.ctx = this.canvasDom.getContext('2d') as CanvasRenderingContext2D;

    this.handleDPR(dom);
    this.initResize(dom);

    this.pluginsInstance = new Plugins(this);

    dom.appendChild(this.canvasDom);

    this.initDarkMode();
  }

  /**
   * deregistration
   */
  public deregistration() {
    this.pluginsInstance.deregistration();
  }

  private initDarkMode() {
    this.on(EventConstant.DARK_MODE_CHANGE, () => {
      if (this.canvasDom) {
        this.canvasDom.style.backgroundColor = this.color('white')
      }
    })
  }

  /**
   * 初始化resize
   */
  private initResize(dom: HTMLElement) {
    const func = () => {
      this.handleDPR(dom);
      this._render();
    }
    window.addEventListener('resize', func);
    this.once(EventConstant.DESTROY, () => {
      window.removeEventListener('resize', func);
    });
  }


  /**
   * 处理高分屏的比例
   */
  private handleDPR(dom: HTMLElement) {
    if (!this.canvasDom || !this.ctx) {
      return;
    }
    let dpr = window.devicePixelRatio;
    const cssWidth = dom.clientWidth;
    const cssHeight = dom.clientHeight;
    this.width = cssWidth;
    this.height = cssHeight;
    this.canvasDom.style.width = cssWidth + "px";
    this.canvasDom.style.height = cssHeight + "px";

    this.canvasDom.width = dpr * cssWidth;
    this.canvasDom.height = dpr * cssHeight;
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
      return result.map(item => item / this._scale) as [number, number];
    }

    if (alwayInner) {
      result[0] = Math.max(0, result[0]);
      result[1] = Math.max(0, result[1]);

      result[0] = Math.min(this._width, result[0]);
      result[1] = Math.min(this._height, result[1]);
      return result as [number, number];
    }

    return false;
  }

  /**
   * getCellByPoint
   * 通过相对于视图的坐标获取当前点击的单元格
   */
  public getCellByPoint(point: [number, number]) {
    const { renderCellsArr, renderSpanCellsArr } = this;

    let selectedCell: selectedCellType | null = null;

    // 点击最左上角的
    if (point[0] <= this.paddingLeft && point[1] <= this.paddingTop) {
      selectedCell = {
        row: -1,
        column: -1
      }
    } else if (point[0] <= this.paddingLeft) { // 计算选中的左侧bar
      renderCellsArr.map(row => row[0]).some(cell => {
        if (judgeOver(point, [0, cell.point[1], this.width, cell.h])) {
          selectedCell = {
            row: cell.location.row,
            column: -1,
          };
          return true;
        }
        return false
      })
    } else if (point[1] <= this.paddingTop) {   // 计算选中的上方bar
      renderCellsArr[0].some(cell => {
        if (judgeOver(point, [cell.point[0], 0, cell.w, this.height])) {
          selectedCell = {
            row: -1,
            column: cell.location.column,
          };
          return true;
        }
        return false
      })
    } else {  // 计算中间的常规cell
      renderSpanCellsArr.forEach(item => {
        if (judgeOver(point, [item.point[0], item.point[1], item.w, item.h])) {
          selectedCell = {
            row: item.location.row,
            column: item.location.column,
          };
        }
      })
      if (selectedCell) {
        return selectedCell;
      }
      renderCellsArr.some(row => {
        if (row.length > 0) {
          if (point[1] >= row[0].point[1] && point[1] < (row[0].point[1] + row[0].h)) {
            row.some(cell => {
              if (judgeOver(point, [cell.point[0], cell.point[1], cell.w, cell.h])) {
                selectedCell = {
                  row: cell.location.row,
                  column: cell.location.column,
                };
                return true;
              }
              return false
            })
            return true;
          }
        }
        return false;
      })
    }

    return selectedCell as selectedCellType | null;
  }

  /**
   * getRectByCell
   */
  public getRectByCell(cell: {
    row: number;
    column: number
  }) {
    const { _data, paddingLeft, scrollTop, scrollLeft, paddingTop } = this;
    // 手动深拷贝
    const startCell = {
      row: cell.row,
      column: cell.column,
    };
    const endCell = {
      row: cell.row,
      column: cell.column,
    };
    if (this._data.spanCells && this._data.spanCells[cell.row + '_' + cell.column]) {
      endCell.row += this._data.spanCells[cell.row + '_' + cell.column].span[1] - 1
      endCell.column += this._data.spanCells[cell.row + '_' + cell.column].span[0] - 1;
    }
    return [
      _data.w.slice(0, startCell.column).reduce((a, b) => a + b, 0) + paddingLeft - scrollLeft,
      _data.h.slice(0, startCell.row).reduce((a, b) => a + b, 0) + paddingTop - scrollTop,
      _data.w.slice(startCell.column, endCell.column + 1).reduce((a, b) => a + b, 0),
      _data.h.slice(startCell.row, endCell.row + 1).reduce((a, b) => a + b, 0),
    ] as rectType
  }

  /**
   * getRealCell
   */
  public getRealCell(cell: {
    row: number;
    column: number
  }) {
    if (this._data.spanCells && this._data.spanCells[cell.row + '_' + cell.column]) {
      return this._data.spanCells[cell.row + '_' + cell.column];
    }
    return this._data.cells[cell.row].cells[cell.column];
  }
}

export default Base