import Base from '../../base/base';
import { throttle } from '../../../utils';
import { PluginTypeEnum } from '..';

export default class FPSPlugin {
  private _this: Base;
  public name: string;
  private dom: HTMLElement;
  private _fps: string;
  private throttleRefresh: () => void;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.FPSPlugin;
    this._this = _this;

    this._fps = '0';
    this.dom = document.createElement('div');
    this.initDom();
    this.initListener();
    this.throttleRefresh = throttle(this.handleFPS.bind(this), 300);
  }

  get fps() {
    return this._fps;
  }
  set fps(v) {
    this._fps = v;
    this.throttleRefresh();
  }

  private initDom() {
    this.dom.className = 'kgsheet-fps';
    this.dom.style.position = 'absolute';
    this.dom.style.color = 'gray';
    this.dom.style.top = '5px';
    this.dom.style.right = '20px';
    this.dom.style.fontSize = '20px';
    this.dom.style.fontWeight = '800';
    this.dom.style.pointerEvents = 'none';

    this.dom.innerText = '';

    this._this.wrapperDom?.appendChild(this.dom);
  }

  private initListener() {
    let preTime = +new Date();

    const cb = () => {
      const currentTime = +new Date();
      this.fps = (1000 / (currentTime - preTime)).toFixed(1);
      preTime = currentTime;
      window.requestAnimationFrame(() => {
        cb();
      });
    };

    window.requestAnimationFrame(() => {
      cb();
    });
  }

  private handleFPS() {
    this.dom.innerText = `FPS: ${this.fps}`;
  }
}
