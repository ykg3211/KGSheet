import Excel from "../core";
import Base from "./base";
import { config } from './interface'

interface ToolBarType {
  sheet: Excel,
  config: config
}
class ToolBar extends Base {
  constructor({
    sheet,
    config
  }: ToolBarType) {
    super(sheet, config);
  }
}

export default ToolBar;