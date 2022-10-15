import { PluginTypeEnum } from "..";
import Base from "../../core/base/base";
import { excelConfig } from "../../interfaces";
import { CellCornerScopeType } from "../SelectAndInput/EditCellPlugin";
import EventMap, { BaseCellsChangeEventStackType, EventType } from ".";

export interface BaseEventType {
  type: EventType,
  params: BaseCellsChangeEventStackType
}

// (this[EventType.CELLS_CHANGE])(1)

export default class BaseEventStack {
  private EVENT_STACK: BaseEventType[][];
  private REVERSE_STACK: BaseEventType[][];
  public _this: Base;
  public name: string;


  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.EventStack;

    this.EVENT_STACK = [];
    this.REVERSE_STACK = [];


    const a = document.createElement('div');
    a.innerHTML = 'reverse';
    a.onclick = this.reverse.bind(this);
    const b = document.createElement('div');
    b.innerHTML = 'anti_reverse';
    b.onclick = this.anti_reverse.bind(this);

    document.getElementById('tools').appendChild(a)
    document.getElementById('tools').appendChild(b)
  }

  public push(events: BaseEventType[]) {
    this.REVERSE_STACK = [];
    events.forEach(event => {
      this[event.type]?.(event.params);
    })
    this.EVENT_STACK.push(events);
  }

  public reverse() {
    const pres = this.EVENT_STACK.pop();
    if (pres) {
      for (let i = pres.length - 1; i >= 0; i--) {
        const pre = pres[i];
        this[pre.type](pre.params, true);
      }
      this.REVERSE_STACK.push(pres);
    }
  }

  public anti_reverse() {
    const pres = this.REVERSE_STACK.pop();
    if (pres) {
      pres.forEach(pre => {
        this[pre.type](pre.params);
      })
      this.EVENT_STACK.push(pres);
    }
  }
}