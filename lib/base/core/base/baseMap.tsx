import { EventConstant } from "../../plugins/event";
import Render from "./render";

export default class BaseMap extends Render {
  constructor(dom: HTMLElement) {
    super();

    this.canvasDom = document.createElement('canvas');
    this.ctx = this.canvasDom.getContext('2d') as CanvasRenderingContext2D;

    this.handleDPR(dom);
    this.initResize(dom);
    this.handleScroll();

    dom.appendChild(this.canvasDom);
  }

  initResize(dom: HTMLElement) {
    const func = () => {
      this.handleDPR(dom);
      this._render();
    }
    window.addEventListener('resize', func);
    this.once(EventConstant.DESTROY, () => {
      window.removeEventListener('resize', func);
    });
  }

  handleDPR(dom: HTMLElement) {
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

  handleScroll() {
    document.body.style.overscrollBehaviorX = 'none';
    const handler = (e: WheelEvent) => {
      const { deltaX, deltaY } = e;

      if (this.scrollLeft + deltaX < 0 || this.contentWidth - this.width < 0) {
        this.scrollLeft = 0;
      } else {
        if (this.scrollLeft + deltaX > (this.contentWidth - (this.width / this.scale) + this.paddingLeft * 2)) {
          this.scrollLeft = (this.contentWidth - (this.width / this.scale) + this.paddingLeft * 2);
        } else {
          this.scrollLeft = this.scrollLeft + deltaX;
        }
      }
      if (this.scrollTop + deltaY < 0 || this.contentHeight - this.height < 0) {
        this.scrollTop = 0;
      } else {
        if (this.scrollTop + deltaY > (this.contentHeight - (this.height / this.scale) + this.paddingTop * 2)) {
          this.scrollTop = (this.contentHeight - (this.height / this.scale) + this.paddingTop * 2);
        } else {
          this.scrollTop = this.scrollTop + deltaY;
        }
      }
    }
    this.canvasDom?.addEventListener('wheel', handler);
    this.once(EventConstant.DESTROY, () => {
      this.canvasDom?.removeEventListener('wheel', handler);
    });
  }
}