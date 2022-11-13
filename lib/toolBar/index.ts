import Excel from "../core";
import Base from "./base";
import { config } from './interface'

class ToolBar extends Base {
  constructor(sheet: Excel, config: config) {
    super(sheet);
    console.log(1);
  }
}

export default ToolBar;