import Base from '../../base/base';
import { PluginTypeEnum } from '..';

export default class ImageStackPlugin {
  private _this: Base;
  public name: string;
  private imgMap: Record<string, null | HTMLImageElement>;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.ImageStackPlugin;
    this._this = _this;
    this.imgMap = {};
  }

  public getImage(url: string) {
    if (this.imgMap[url] === undefined) {
      this.loadImage(url);
    }
    return this.imgMap[url] || null;
  }

  private loadImage(url: string) {
    const img = new Image();
    this.imgMap[url] = null;
    img.onload = () => {
      this.imgMap[url] = img;
      this._this.render();
    };
    img.src = url;
  }
}
