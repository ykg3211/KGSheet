import Excel from "../../core";
import BaseEvent from "../../core/plugins/base/event";
import { config } from '../interface'

export default class Base extends BaseEvent {
  public sheet: Excel;
  private Tools: any[];
  constructor(sheet: Excel, config: config) {
    super();
    this.sheet = sheet;
    sheet.ToolBar = this;

    this.initTools(config);
  }

  private initTools(config: config) {

  }
}