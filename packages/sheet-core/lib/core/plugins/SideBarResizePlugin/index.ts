// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginTypeEnum } from '..';
import Base from '../../base/base';
import { EventZIndex, RenderZIndex } from '../../base/constant';
import { isNN } from '../../../utils';
import { EventConstant } from '../base/event';
import ExcelBaseFunction from '../EventStack';

export default class SideBarResizePlugin {
  private _this: Base;
  private gap: number;
  public name: string;
  private ExcelBaseFunction!: ExcelBaseFunction;
  private selectedRowColumn: {
    isRow: boolean;
    index: number;
  } | null;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.SideBarResizePlugin;
    this._this = _this;
    this.gap = 5;
    this.selectedRowColumn = null;

    this.handleMouseHover();
    this.handleMouseDrag();
    this.initPlugin();
    this.initRender();
  }

  private initPlugin() {
    const ExcelBaseFunction = this._this.getPlugin(PluginTypeEnum.ExcelBaseFunction);
    if (ExcelBaseFunction) {
      this.ExcelBaseFunction = ExcelBaseFunction;
    } else {
      console.error('SideBarResizePlugin 依赖于 ExcelBaseFunction, 请正确注册插件!');
    }
  }

  protected remove() {
    this._this.devMode && console.log('remove: SideBarResizePlugin');
    this._this.clearEvent(EventConstant.MOUSE_DOWN, EventZIndex.SIDE_BAR);
    this._this.clearEvent(EventConstant.MOUSE_MOVE, EventZIndex.SIDE_BAR);
    this._this.clearEvent(EventConstant.MOUSE_UP, EventZIndex.SIDE_BAR);
  }

  private initRender() {
    this._this.addRenderFunction(RenderZIndex.BORDER_HIGH_LIGHT, [
      (ctx) => {
        if (this.selectedRowColumn) {
          this._this.drawRowColumnBorder({
            ctx,
            isRow: this.selectedRowColumn.isRow,
            index: this.selectedRowColumn.index,
          });
        }
      },
    ]);
  }

  private registerHighLight({ isRow, index }: { isRow: boolean; index: number }) {
    this.selectedRowColumn = {
      isRow,
      index,
    };
  }
  private resetHighLight() {
    this.selectedRowColumn = null;
  }

  private handleMouseDrag() {
    let isStart = false;
    let initWidth: null | number = null;
    let XMouseDownLastFrameX: number | null = null;
    let YMouseDownLastFrameY: number | null = null;
    let isRow = false;
    let origin: number | undefined | null = null;
    const scrollMouseDownCB = (e: MouseEvent, preData: any) => {
      const { isRow: _isRow, index } = preData;
      isStart = true;
      XMouseDownLastFrameX = e.pageX;
      YMouseDownLastFrameY = e.pageY;
      isRow = Boolean(_isRow);
      origin = index;
      this.registerHighLight({
        isRow,
        index,
      });
      if (typeof origin === 'number') {
        initWidth = isRow ? this._this._data.h[origin] : this._this._data.w[origin];
      }
      this._this.render();
    };

    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SIDE_BAR,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }
        const { isHoverBar, isRow: _isRow, index } = this.getSideBarByPoint(point as [number, number]);
        if (!isHoverBar) {
          return false;
        }
        return { isHoverBar, isRow: _isRow, index };
      },
      innerFunc: scrollMouseDownCB.bind(this),
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (isRow) {
        if (typeof YMouseDownLastFrameY === 'number' && typeof origin === 'number') {
          this._this._data.h[origin] += (e.pageY - YMouseDownLastFrameY) / this._this.scale;
          this._this._data.h[origin] = Math.max(10, this._this._data.h[origin]);
          this._this.render();
          YMouseDownLastFrameY = e.pageY;
        }
      } else {
        if (typeof XMouseDownLastFrameX === 'number' && typeof origin === 'number') {
          this._this._data.w[origin] += (e.pageX - XMouseDownLastFrameX) / this._this.scale;
          this._this._data.w[origin] = Math.max(10, this._this._data.w[origin]);
          this._this.render();
          XMouseDownLastFrameX = e.pageX;
        }
      }
    };

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SIDE_BAR,
      judgeFunc: () => {
        return isStart;
      },
      innerFunc: handleMouseMove.bind(this),
    });

    const scrollMouseUpCB = () => {
      if (isStart && typeof origin === 'number' && typeof initWidth === 'number') {
        if (typeof origin === 'number') {
          const currentWidth = isRow ? this._this._data.h[origin] : this._this._data.w[origin];
          this.ExcelBaseFunction.rowColumnResize({
            isRow: isRow,
            index: origin,
            preWidth: initWidth,
            afterWidth: currentWidth,
          });
        }
      }
      origin = null;
      isStart = false;
      initWidth = null;
      XMouseDownLastFrameX = null;
      YMouseDownLastFrameY = null;
      this.resetHighLight();
    };
    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.SIDE_BAR,
      judgeFunc: () => isStart,
      innerFunc: scrollMouseUpCB.bind(this),
    });
  }

  private handleMouseHover() {
    // 处理鼠标悬浮改变样式的。
    const handleOverCursor = (
      e: MouseEvent & {
        _mouseY: number;
        _mouseX: number;
      },
      { isRow }: { isRow: boolean },
    ) => {
      if (this._this.canvasDom) {
        this._this.canvasDom.style.cursor = isRow ? 'ns-resize' : 'ew-resize';
      }
    };

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SIDE_BAR,
      judgeFunc: (e: any) => {
        if (!isNN(e._mouseY) && !isNN(e._mouseX)) {
          const { isHoverBar, isRow } = this.getSideBarByPoint([e._mouseX, e._mouseY]);
          if (isHoverBar) {
            return { isRow };
          }
        }
        return false;
      },
      // @ts-ignore
      innerFunc: handleOverCursor.bind(this),
      outerFunc: () => {
        if (this._this.canvasDom) {
          this._this.canvasDom.style.cursor = 'default';
        }
      },
    });
  }

  public getSideBarByPoint(point: [number, number]) {
    const { _scrollTop, _scrollLeft, renderDataScope, _data, paddingLeft, paddingTop } = this._this as Base;

    // 排除在外的情况
    if (!((point[0] > 0 && point[0] < paddingLeft) || (point[1] > 0 && point[1] < paddingTop))) {
      return {
        isHoverBar: false,
      };
    }

    const isRow = point[0] > 0 && point[0] < paddingLeft ? true : !(point[1] > 0 && point[1] < paddingTop);

    const source = isRow ? _data.h : _data.w;

    let start = 0;
    if (isRow) {
      start = source.slice(0, renderDataScope[0][0]).reduce((a, b) => a + b, 0) + paddingTop - _scrollTop;
    } else {
      start = source.slice(0, renderDataScope[0][1]).reduce((a, b) => a + b, 0) + paddingLeft - _scrollLeft;
    }
    const anchorArr: number[] = [];
    source.slice(renderDataScope[0][isRow ? 0 : 1], renderDataScope[1][isRow ? 0 : 1] + 1).forEach((item) => {
      start += item;
      anchorArr.push(start);
    });
    let isHoverBar = false;

    let startIndex = renderDataScope[0][isRow ? 0 : 1];
    anchorArr.some((y, arrI) => {
      if (y - this.gap < point[isRow ? 1 : 0] && y + this.gap > point[isRow ? 1 : 0]) {
        startIndex += arrI;
        isHoverBar = true;
        return true;
      }
      return false;
    });
    return {
      isHoverBar,
      isRow,
      index: startIndex,
    };
  }
}
