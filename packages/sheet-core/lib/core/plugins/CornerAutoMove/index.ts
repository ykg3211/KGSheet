import Base from '../../base/base';
import { PluginTypeEnum } from '..';
import KeyboardPlugin from '../KeyboardPlugin';
import SelectPowerPlugin from '../SelectAndInput/SelectPowerPlugin';
import { judgeOver, nextTick } from '../../../utils';
import { EventConstant } from '../base/event';

// 主要用于计算style
const INIT_V = 'init_v'; // 初始态
const NOT_SAME = 'not_same'; // 一堆cell的属性不同的标志

export default class CornerAutoMove {
  private _this: Base;
  public name: string;
  private mouseX: number;
  private mouseY: number;
  private borderGapX: number; // 会触发滑动的边距
  private borderGapY: number; // 会触发滑动的边距
  private isStart: boolean;
  private needStop: boolean;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.CornerAutoMove;
    this._this = _this;

    this.mouseX = 0;
    this.mouseY = 0;

    this.borderGapX = 10;
    this.borderGapY = 10;
    this.isStart = false;
    this.needStop = false;

    this.register();
  }

  private register() {
    const mousemoveCB = (e: MouseEvent) => {
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    };
    document.body.addEventListener('mousemove', mousemoveCB);

    const mouseupCB = () => {
      this.needStop = true;
    };
    document.body.addEventListener('mouseup', mouseupCB);

    this._this.on(EventConstant.DESTROY, () => {
      document.body.removeEventListener('mousemove', mousemoveCB);
      document.body.removeEventListener('mouseup', mouseupCB);
    });
  }

  public start() {
    if (!this._this.canvasDom) {
      return false;
    }
    if (!this.isStart) {
      this.needStop = false;
      this.render();
    }
  }

  private stopCB() {
    this.isStart = false;
    this.needStop = false;
  }

  private async render() {
    if (this.needStop) {
      this.stopCB();
      return;
    }
    this.isStart = true;
    const offset = this.handleOffset({
      x: this.mouseX,
      y: this.mouseY,
    });
    if (!offset) {
      this.stopCB();
      return;
    }

    this._this.scrollXY(offset.offsetX / this._this.scale, offset.offsetY / this._this.scale);

    await nextTick();
    this.render();
  }

  private handleOffset({ x, y }: { x: number; y: number }) {
    if (!this._this.canvasDom) {
      return false;
    }

    const domOffsetLeft = this._this.canvasDom.offsetLeft + this._this.paddingLeft + this.borderGapX;
    const domOffsetRight = this._this.canvasDom.offsetLeft + this._this.canvasDom.offsetWidth - this.borderGapX;

    const domOffsetTop = this._this.canvasDom.offsetTop + this._this.paddingTop + this.borderGapY;
    const domOffsetBottom = this._this.canvasDom.offsetTop + this._this.canvasDom.offsetHeight - this.borderGapY;
    let offsetX = 0;
    let offsetY = 0;

    if (x < domOffsetLeft) {
      offsetX = -20;
    } else if (x > domOffsetRight) {
      offsetX = 20;
    }

    if (y < domOffsetTop) {
      offsetY = -20;
    } else if (y > domOffsetBottom) {
      offsetY = 20;
    }

    if (offsetX === 0 && offsetY === 0) {
      return false;
    }

    return {
      offsetX,
      offsetY,
    };
  }
}
