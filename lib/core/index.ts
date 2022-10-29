import { EventConstant } from "./plugins/base/event";
import Base from "./base/base";
import { excelConfig } from "../interfaces";

class Excel extends Base {
  constructor(dom: any) {
    super(dom);
  }

  public getData() {

  }

  public setData(data: excelConfig) {
    if (data) {
      console.log(data);
      this.data = data;
    }
  }

  public destroy() {
    this.emit(EventConstant.DESTROY);
  }
}

export default Excel;