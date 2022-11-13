import Excel from "../../core";
import BaseEvent from "../../core/plugins/base/event";

export default class Base extends BaseEvent {
  public sheet: Excel;
  constructor(sheet: Excel) {
    super();
    this.sheet = sheet;
    sheet.ToolBar = this;
  }
}