// @ts-n ocheck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import Base from "../../base/base";
import { EventZIndex, RenderZIndex } from "../../base/constant";
import { EventConstant } from "../base/event";
import { isNN } from "../../../utils";
import { judgeOver } from "../../../utils";
import { PluginTypeEnum } from "..";
import { rectType } from "../../base/drawLayer";
export default class ScrollPlugin {
  private _this: Base;
  public name: string;
  private scrollBarXW: number;
  private scrollBarYW: number;
  private Xxywh: rectType; // X轴滚动块的坐标
  private Yxywh: rectType; // Y轴滚动块的坐标

  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.ScrollPlugin;
    this._this._scrollBarWidth = 10;

    this.initDragScroll();

    this.Xxywh = [0, 0, 0, 0];
    this.Yxywh = [0, 0, 0, 0];
    this.scrollBarXW = this._this.width;
    this.scrollBarYW = this._this.height;
    this.handleScroll();

    this._this.addRenderFunction(RenderZIndex.SCROLL_BAR, [this.handleScrollBar.bind(this)])
  }

  // 初始化拖拽滚动条的逻辑；
  private initDragScroll() {
    let XMouseDownOriginX: number | null = null;
    let YMouseDownOriginY: number | null = null;
    const scrollMouseDownCB = (e: MouseEvent, point) => {
      const isX = judgeOver([point[0], point[1]], this.Xxywh);
      const isY = judgeOver([point[0], point[1]], this.Yxywh);

      if (isX) {
        XMouseDownOriginX = e.pageX;
      }
      if (isY) {
        YMouseDownOriginY = e.pageY;
      }
    }
    this._this.setEvent(EventConstant.MOUSE_DOWN, {
      type: EventZIndex.SCROLL_BAR,
      judgeFunc: (e) => {
        const point = this._this.transformXYInContainer(e);
        if (!point) {
          return false;
        }
        if (point[0] > this._this.width - this._this.scrollBarWidth || point[1] > this._this.height - this._this.scrollBarWidth) {
          return point;
        }

        return false;
      },
      innerFunc: scrollMouseDownCB.bind(this)
    })

    const scrollMouseMoveCB = (e: MouseEvent) => {
      if (XMouseDownOriginX !== null) {
        const gap = (e.pageX - XMouseDownOriginX) / this._this.scale;
        this._this.scrollXY(gap / this._this.width * this._this.contentWidth, 0);
        XMouseDownOriginX = e.pageX;
      }
      if (YMouseDownOriginY !== null) {
        const gap = (e.pageY - YMouseDownOriginY) / this._this.scale;
        this._this.scrollXY(0, gap / this._this.height * this._this.contentHeight);
        YMouseDownOriginY = e.pageY;
      }
    }

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SCROLL_BAR,
      judgeFunc: () => {
        return XMouseDownOriginX !== null || YMouseDownOriginY !== null
      },
      innerFunc: scrollMouseMoveCB.bind(this),
    })


    // 处理鼠标悬浮改变样式的。
    const handleOverCursor = (e: MouseEvent) => {
      if (judgeOver([e._mouseX, e._mouseY], this.Xxywh)) {
        document.body.style.cursor = 'grab';
      }
      if (judgeOver([e._mouseX, e._mouseY], this.Yxywh)) {
        document.body.style.cursor = 'grab';
      }
    }

    this._this.setEvent(EventConstant.MOUSE_MOVE, {
      type: EventZIndex.SCROLL_BAR,
      judgeFunc: (e) => {
        if (!isNN(e._mouseY) && !isNN(e._mouseX)) {
          if (judgeOver([e._mouseX, e._mouseY], this.Xxywh) || judgeOver([e._mouseX, e._mouseY], this.Yxywh)) {
            return true;
          } else {
            return false
          }
        } else {
          return false;
        }
      },
      innerFunc: handleOverCursor.bind(this),
      outerFunc: () => {
        document.body.style.cursor = 'default';
      }
    })

    const scrollMouseUpCB = () => {
      XMouseDownOriginX = null;
      YMouseDownOriginY = null;
    }
    this._this.setEvent(EventConstant.MOUSE_UP, {
      type: EventZIndex.SCROLL_BAR,
      judgeFunc: () => XMouseDownOriginX !== null || YMouseDownOriginY !== null,
      innerFunc: scrollMouseUpCB.bind(this)
    })
  }

  private handleScrollBar(ctx: CanvasRenderingContext2D) {
    const { width: maxWidth, height: maxHeight } = this._this.getMaxScrollBound();
    const YTop = this._this.height - this._this.scrollBarWidth;
    const XLeft = this._this.width - this._this.scrollBarWidth;
    // 画X轴滚动条
    if (this._this.width < this._this.contentWidth) {
      this.scrollBarXW = Math.max(this._this.width * this._this.width / this._this.contentWidth, 20)
      const percentX = this._this.scrollLeft / maxWidth;
      ctx.fillStyle = this._this.color('white');
      ctx.lineWidth = 1;
      ctx.strokeStyle = this._this.color('line');
      ctx.beginPath();
      ctx.moveTo(0, YTop);
      ctx.lineTo(this._this.width, YTop);
      ctx.stroke();
      ctx.fillRect(0, YTop, this._this.width, this._this.scrollBarWidth);
      ctx.fillStyle = this._this.color('scrollBar');


      this.Xxywh = [(this._this.width - this.scrollBarXW - (this._this.height < this._this.contentHeight ? this._this.scrollBarWidth : 0)) * percentX, YTop, this.scrollBarXW, this._this.scrollBarWidth]

      ctx.fillRect(...this.Xxywh);
    }

    // 画Y轴滚动条
    if (this._this.height < this._this.contentHeight) {
      this.scrollBarYW = Math.max(this._this.height * this._this.height / this._this.contentHeight, 20)
      const percentY = this._this.scrollTop / maxHeight;
      ctx.fillStyle = this._this.color('white');
      ctx.lineWidth = 1;
      ctx.strokeStyle = this._this.color('line');
      ctx.beginPath();
      ctx.moveTo(XLeft, 0);
      ctx.lineTo(XLeft, YTop);
      ctx.stroke();
      ctx.fillRect(XLeft, 0, this._this.scrollBarWidth, this._this.height);
      ctx.fillStyle = this._this.color('scrollBar');


      this.Yxywh = [XLeft, (this._this.height - this.scrollBarYW) * percentY, this._this.scrollBarWidth, this.scrollBarYW]

      ctx.fillRect(...this.Yxywh);
    }
  }

  private handleScroll() {
    document.body.style.overscrollBehaviorX = 'none';
    let isShift = false;
    let isControl = false;

    const handler = (e: WheelEvent) => {
      const { deltaX: _deltaX, deltaY: _deltaY } = e;
      let deltaX = _deltaX;
      let deltaY = _deltaY;

      if (isControl) {
        const initScale = this._this.scale;
        const originAbsoluteX = this._this.scrollTop + e.pageY;
        const originAbsoluteY = this._this.scrollLeft + e.pageX;
        const temp = this._this.scale + (deltaY / 1000);
        this._this.scale = temp < this._this.minScale ? this._this.minScale : (temp > this._this.maxScale ? this._this.maxScale : temp);

        // todo @yukaige 缩放的时候中心是鼠标位置。
        const changeMultiple = this._this.scale / initScale;

        const changeX = (changeMultiple - 1) * originAbsoluteX || 0;
        const changeY = (changeMultiple - 1) * originAbsoluteY || 0;
        // this._this.scrollXY(changeX, changeY)
        return;
      }

      if (isShift) {
        const temp = deltaX;
        deltaX = deltaY;
        deltaY = temp;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          deltaY = 0
        } else {
          deltaX = 0
        }
      }

      this._this.scrollXY(deltaX, deltaY)
    }

    this._this.canvasDom?.addEventListener('wheel', handler);

    const keyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Shift': isShift = true; break;
        case 'Control': isControl = true; break;
        default: break;
      }
    }
    const keyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Shift': isShift = false; break;
        case 'Control': isControl = false; break;
        default: break;
      }
    }
    document.body.addEventListener('keydown', keyDown);
    document.body.addEventListener('keyup', keyUp);

    this._this.once(EventConstant.DESTROY, () => {
      this._this.canvasDom?.removeEventListener('wheel', handler);
      document.body.removeEventListener('keydown', keyDown);
      document.body.removeEventListener('keyup', keyUp);
    });
  }
}