import { EventConstant } from "../../plugins/event";
import Render from "./render";
import Plugins from "../../plugins";
import { dispatchEventType, setEventType, clearEventType } from "../../plugins/EventStack";

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
    this.on(EventConstant.DARKMODE_CHANGE, () => {
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