// @ts-nocheck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginType } from ".";
import BaseMap from "../core/base/baseMap";
import { renderZIndex } from "../core/base/constant";
import { EventConstant } from "./event";
import judgeHover from "../utils/judgeHover";
import { eventStackType } from "./EventStack";

export default class ScrollPlugin implements PluginType {
  private _this: BaseMap;
  private scrollBarWidth: number;
  private scrollBarXW: number;
  private scrollBarYW: number;
  private Xxywh: [number, number, number, number]; // X轴滚动块的坐标
  private Yxywh: [number, number, number, number]; // Y轴滚动块的坐标

  private scrollMouseDownCB: any; // 重新定义是为了以后remove的时候清除，防止内存泄漏
  private scrollMouseMoveCB: any; // 重新定义是为了以后remove的时候清除，防止内存泄漏
  private scrollMouseUpCB: any; // 重新定义是为了以后remove的时候清除，防止内存泄漏
  // 用来计算拖拽滚动条的距离的参数
  private XMouseDownOriginX: number | null;
  private XIsHover: boolean;
  private YMouseDownOriginY: number | null;
  private YIsHover: boolean;

  constructor(_this: BaseMap) {
    this._this = _this;
    this.scrollBarWidth = 10;

    this.scrollMouseDownCB = null;
    this.scrollMouseMoveCB = null;
    this.scrollMouseUpCB = null;
    this.XMouseDownOriginX = null;
    this.XIsHover = false;
    this.YMouseDownOriginY = null;
    this.YIsHover = false;
    this.initDragScroll();

    this.Xxywh = [0, 0, 0, 0];
    this.Yxywh = [0, 0, 0, 0];
    this.scrollBarXW = this._this.width;
    this.scrollBarYW = this._this.height;
    this.handleScroll();

    this._this.addRenderFunction(renderZIndex.SCROLL_BAR, [this.handleScrollBar.bind(this)])
  }

  private remove() {
    document.body.removeEventListener('mousedown', this.scrollMouseDownCB);
    document.body.removeEventListener('mousemove', this.scrollMouseMoveCB);
    document.body.removeEventListener('mouseup', this.scrollMouseUpCB);
  }

  // 初始化拖拽滚动条的逻辑；
  private initDragScroll() {
    this.scrollMouseDownCB = () => {
      if (this.XIsHover) {
        this.XMouseDownOriginX = this._this.mouseX;
      }
      if (this.YIsHover) {
        this.YMouseDownOriginY = this._this.mouseY;
      }
    }
    this._this.on(EventConstant.MOUSE_DOWN, this.scrollMouseDownCB);

    this.scrollMouseMoveCB = () => {
      if (this.XMouseDownOriginX !== null) {
        const gap = this._this.mouseX - this.XMouseDownOriginX;
        this.scrollXY(gap / this._this.width * this._this.contentWidth, 0);
        this.XMouseDownOriginX = this._this.mouseX;
      }
      if (this.YMouseDownOriginY !== null) {
        const gap = this._this.mouseY - this.YMouseDownOriginY;
        this.scrollXY(0, gap / this._this.height * this._this.contentHeight);
        this.YMouseDownOriginY = this._this.mouseY;
      }
    }
    this._this.on(EventConstant.MOUSE_MOVE, this.scrollMouseMoveCB);

    this.scrollMouseUpCB = () => {
      if (this.XMouseDownOriginX !== null) {
        this.XMouseDownOriginX = null;
      }
      if (this.YMouseDownOriginY !== null) {
        this.YMouseDownOriginY = null;
      }
    }
    this._this.on(EventConstant.MOUSE_UP, this.scrollMouseUpCB);
  }

  private handleScrollBar(ctx: CanvasRenderingContext2D) {
    const that = this;
    const { width: maxWidth, height: maxHeight } = this.getMaxScrollBound();
    const YTop = (this._this.height - this.scrollBarWidth) / this._this.scale;
    const XLeft = (this._this.width - this.scrollBarWidth) / this._this.scale;
    // 画X轴滚动条
    if (this._this.width < this._this.contentWidth) {
      this.scrollBarXW = Math.max(this._this.width * this._this.width / this._this.contentWidth, 20)
      const percentX = this._this.scrollLeft / maxWidth;
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e6e6e6';
      ctx.beginPath();
      ctx.moveTo(0, YTop);
      ctx.lineTo(this._this.width, YTop);
      ctx.stroke();
      ctx.fillRect(0, YTop, this._this.width, this.scrollBarWidth);
      ctx.fillStyle = '#dadada';


      this.Xxywh = [(this._this.width - this.scrollBarXW - (this._this.height < this._this.contentHeight ? this.scrollBarWidth : 0)) * percentX, YTop, this.scrollBarXW, this.scrollBarWidth]
      this._this.emit(EventConstant.MOUSE_HOVER_EVENT, {
        id: 'Xxywh',
        scope: this.Xxywh,
        innerFunc: () => {
          document.body.style.cursor = 'grab';
          that.XIsHover = true;
        },
        outerFunc() {
          document.body.style.cursor = 'default';
          that.XIsHover = false;
        },
      } as eventStackType)

      ctx.fillRect(...this.Xxywh);
    }

    // 画Y轴滚动条
    if (this._this.height < this._this.contentHeight) {
      this.scrollBarYW = Math.max(this._this.height * this._this.height / this._this.contentHeight, 20)
      const percentY = this._this.scrollTop / maxHeight;
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e6e6e6';
      ctx.beginPath();
      ctx.moveTo(XLeft, 0);
      ctx.lineTo(XLeft, YTop);
      ctx.stroke();
      ctx.fillRect(XLeft, 0, this.scrollBarWidth, this._this.height);
      ctx.fillStyle = '#dadada';


      this.Yxywh = [XLeft, (this._this.height - this.scrollBarYW) * percentY, this.scrollBarWidth, this.scrollBarYW]
      this._this.emit(EventConstant.MOUSE_HOVER_EVENT, {
        id: 'Yxywh',
        scope: this.Yxywh,
        innerFunc: () => {
          document.body.style.cursor = 'grab';
          that.YIsHover = true;
        },
        outerFunc() {
          document.body.style.cursor = 'default';
          that.YIsHover = false;
        },
      } as eventStackType)

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
        const originAbsoluteX = this._this.scrollTop + this._this.mouseY;
        const originAbsoluteY = this._this.scrollLeft + this._this.mouseX;
        const temp = this._this.scale + (deltaY / 1000);
        this._this.scale = temp < 1 ? 1 : (temp > this._this.maxScale ? this._this.maxScale : temp);

        // todo @yukaige 缩放的时候中心是鼠标位置。
        const changeMultiple = this._this.scale / initScale;

        const changeX = (changeMultiple - 1) * originAbsoluteX || 0;
        const changeY = (changeMultiple - 1) * originAbsoluteY || 0;
        // this.scrollXY(changeX, changeY)
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

      this.scrollXY(deltaX, deltaY)
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

  private getMaxScrollBound() {
    return {
      height: (this._this.contentHeight - (this._this.height / this._this.scale) + this._this.paddingTop * 2),
      width: (this._this.contentWidth - (this._this.width / this._this.scale) + this._this.paddingLeft * 2)
    }
  }

  private scrollXY(deltaX: number, deltaY: number) {
    const { width: maxWidth, height: maxHeight } = this.getMaxScrollBound();
    if (this._this.scrollLeft + deltaX < 0 || this._this.contentWidth - this._this.width < 0) {
      this._this.scrollLeft = 0;
    } else {
      if (this._this.scrollLeft + deltaX > maxWidth) {
        this._this.scrollLeft = maxWidth;
      } else {
        this._this.scrollLeft = this._this.scrollLeft + deltaX;
      }
    }
    if (this._this.scrollTop + deltaY < 0 || this._this.contentHeight - this._this.height < 0) {
      this._this.scrollTop = 0;
    } else {
      if (this._this.scrollTop + deltaY > maxHeight) {
        this._this.scrollTop = maxHeight;
      } else {
        this._this.scrollTop = this._this.scrollTop + deltaY;
      }
    }
  }
}