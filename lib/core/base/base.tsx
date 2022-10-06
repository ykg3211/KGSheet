import { EventConstant } from "../../plugins/event";
import Render from "./render";
import Plugins from "../../plugins";
import { dispatchEventType, setEventType } from "../../plugins/EventStack";

class Base extends Render {
  protected pluginsInstance: Plugins;
  public setEvent: setEventType;
  public dispatchEvent: dispatchEventType;

  constructor(dom: HTMLElement) {
    super();

    this.canvasDom = document.createElement('canvas');
    this.ctx = this.canvasDom.getContext('2d') as CanvasRenderingContext2D;

    this.handleDPR(dom);
    this.initResize(dom);

    this.pluginsInstance = new Plugins(this);

    dom.appendChild(this.canvasDom);
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

  private handleScroll() {
    document.body.style.overscrollBehaviorX = 'none';
    let isShift = false;

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

    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        isShift = true;
      }
    }
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        isShift = false;
      }
    }
    document.body.addEventListener('keydown', keyDown);
    document.body.addEventListener('keyup', keyUp);

    this.once(EventConstant.DESTROY, () => {
      this.canvasDom?.removeEventListener('wheel', handler);
      document.body.removeEventListener('keydown', keyDown);
      document.body.removeEventListener('keyup', keyUp);
    });
  }

  /**
   * transformInContainer
   * 将screen的xy坐标转化成在容器中的坐标
   */
  public transformXYInContainer(e: MouseEvent) {
    if (!this.canvasDom) {
      return false;
    }
    const result = [e.pageX - this.canvasDom.offsetLeft, e.pageY - this.canvasDom.offsetTop];
    if (result[0] > 0 && result[1] > 0 && result[0] < this._width && result[1] < this._height) {
      return result.map(item => item / this._scale);
    }

    return false;
  }
}

export default Base