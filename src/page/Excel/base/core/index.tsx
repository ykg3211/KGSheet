import { excelConfig } from "../../interfaces";
import { EventConstant } from "../plugins/event";
import BaseMap from "./base/baseMap";
import createBaseConfig from "./baseConfig";

class Excel extends BaseMap {
  constructor(dom: any) {
    super(dom);
    this.initDefault();
  }

  initDefault() {
    this.data = createBaseConfig(1000, 10000)
  }
  destroy() {
    this.emit(EventConstant.DESTROY);
  }
}

const map: Record<string, Excel> = {

}

export default Excel;