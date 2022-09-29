import { EventConstant } from "../plugins/event";
import BaseMap from "./base/baseMap";
import createDefaultData from "../utils/defaultData";

class Excel extends BaseMap {
  constructor(dom: any) {
    super(dom);
    this.initDefault();
  }

  protected initDefault() {
    this.data = createDefaultData(20, 100);
  }

  public destroy() {
    this.emit(EventConstant.DESTROY);
  }
}

export default Excel;