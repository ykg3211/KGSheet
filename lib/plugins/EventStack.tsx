// @ts-no check
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import Base from "../core/base/base";
import { EventZIndex } from "../core/base/constant";
import { EventConstant } from "./event";

export interface EventStackType {
  type: EventZIndex;
  judgeFunc: (e: MouseEvent) => boolean;
  innerFunc: (e: MouseEvent) => void | Array<(e: MouseEvent) => void>;
  outerFunc?: (e: MouseEvent) => void | Array<(e: MouseEvent) => void>;
}
export enum EventType {

}

export type setEventType = (type: EventConstant) => ((props: EventStackType) => void);
export type dispatchEventType = (type: EventConstant) => ((e: MouseEvent) => void);

export default class EventStack {
  private _this: Base;
  private eventStack: Partial<Record<EventConstant, EventStackType[]>>;
  // eventStack: {
  //   mouse_move: [
  //     {

  //     }
  //   ]
  // }
  constructor(_this: Base) {
    this._this = _this;
    this.eventStack = {};
    this._this.setEvent = this.setEvent.bind(this);
    this._this.dispatchEvent = this.dispatchEvent.bind(this);
  }

  protected setEvent(type: EventConstant) {
    if (!this.eventStack[type]) {
      this.eventStack[type] = [];
    }

    return (props: EventStackType) => {
      const pointer = this.eventStack[type][props.type];
      if (pointer) {
        if (pointer.innerFunc instanceof Array) {
          pointer.innerFunc = [...pointer.innerFunc, props.innerFunc];
        } else {
          pointer.innerFunc = [pointer.innerFunc, props.innerFunc];
        }
        if (!props.outerFunc) {
          return;
        }
        if (pointer.outerFunc) {
          if (pointer.outerFunc instanceof Array) {
            pointer.outerFunc = [...pointer.outerFunc, props.outerFunc];
          } else {
            pointer.outerFunc = [pointer.outerFunc, props.outerFunc];
          }
        } else {
          pointer.outerFunc = props.outerFunc;
        }
      } else {
        this.eventStack[type][props.type] = props;
      }
    }
  }

  protected dispatchEvent(type: EventConstant) {
    return (e: MouseEvent) => {
      const innerFuncArr: ((e: MouseEvent) => void)[] = [];
      const outerFuncArr: ((e: MouseEvent) => void)[] = [];
      this.eventStack[type]?.forEach(event => {
        if (event.judgeFunc?.()) {
          innerFuncArr.push(event.innerFunc);
        } else {
          event.outerFunc && outerFuncArr.push(event.outerFunc);
        }
      })
      outerFuncArr.flat().forEach(fn => fn(e))
      innerFuncArr.flat().forEach(fn => fn(e))
    }
  }
}