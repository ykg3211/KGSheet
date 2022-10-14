import { PluginTypeEnum } from "..";
import Base from "../../core/base/base";
import { excelConfig } from "../../interfaces";
import { CellCornerScopeType } from "../SelectAndInput/EditCellPlugin";
import EventMap from "./EventMap";

export interface BaseEventType {

}

export default class EventStack extends EventMap {
  private EVENT_STACK: BaseEventType[];
  private REVERSE_STACK: BaseEventType[];

  constructor(_this: Base) {
    super(_this);
  }

  public push(event: BaseEventType) {

  }

  public reverse() {

  }

  public anti_reverse() {

  }
}