// @ts-no check
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import { PluginTypeEnum } from '..';
import Base from '../../base/base';
import { EventZIndex } from '../../base/constant';
import { EventConstant } from './event';

// preData 是为了服用judge得到的值
type preData = any;
export interface EventStackType {
  type: EventZIndex;
  /**
   * 一个用来判断是进入innerFunc的判断方法，
   * 返回 false代表是outer，
   * 返回true或者任何值，代表inner，并且把该值重新当成inner的入参
   */
  judgeFunc: (e: MouseEvent) => boolean | preData;
  innerFunc: (e: MouseEvent, preData?: preData) => void | Array<(e: MouseEvent) => void>;
  outerFunc?: (e: MouseEvent, preData?: preData) => void | Array<(e: MouseEvent) => void>;
}

export type setEventType = (type: EventConstant | EventConstant[], props: EventStackType) => void;
export type clearEventType = (type: EventConstant, zIndex: EventZIndex) => void;
export type dispatchEventType = (type: EventConstant, e: MouseEvent) => void;

export default class EventDispatch {
  private _this: Base;
  public name: string;
  private eventStack: Partial<Record<EventConstant, Array<EventStackType[]>>>;
  // 结构
  // eventStack: {
  //   mouse_move: [
  //     [
  //       {
  //         type: EventZIndex;
  //         judgeFunc: (e: MouseEvent) => boolean;
  //         innerFunc: (e: MouseEvent) => void | Array<(e: MouseEvent) => void>;
  //         outerFunc?: (e: MouseEvent) => void | Array<(e: MouseEvent) => void>;
  //       }
  //     ]
  //   ]
  // }
  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.EventDispatch;
    this.eventStack = {};
    this._this.setEvent = this.setEvent.bind(this);
    this._this.dispatchEvent = this.dispatchEvent.bind(this);
    this._this.clearEvent = this.clearEvent.bind(this);
  }

  protected clearEvent(type: EventConstant, subType: EventZIndex) {
    if (!this.eventStack[type]) {
      return;
    }
    // @ts-ignore
    this.eventStack[type][subType] = [];
  }

  protected setEvent(type: EventConstant | EventConstant[], props: EventStackType) {
    if (!(type instanceof Array)) {
      type = [type];
    }

    type.forEach((t) => {
      if (!this.eventStack[t]) {
        this.eventStack[t] = [];
      }
      // @ts-ignore
      const pointer = this.eventStack[t][props.type];
      if (pointer) {
        pointer.push(props);
      } else {
        // @ts-ignore
        this.eventStack[t][props.type] = [props];
      }
    });
  }

  protected dispatchEvent(type: EventConstant, e: MouseEvent) {
    // 用于处理触摸事件的
    if (e instanceof TouchEvent) {
      const touchAttrs = e.changedTouches[0] || {};
      (e as any).clientX = touchAttrs.clientX;
      (e as any).clientY = touchAttrs.clientY;
      (e as any).pageX = touchAttrs.pageX;
      (e as any).pageY = touchAttrs.pageY;
      (e as any).screenX = touchAttrs.screenX;
      (e as any).screenY = touchAttrs.screenY;
    }

    const innerFuncArr: ((e: MouseEvent) => void)[] = [];
    const outerFuncArr: ((e: MouseEvent) => void)[] = [];
    let isFirst = true;
    this.eventStack[type]?.forEach((events) => {
      if (!isFirst) {
        return;
      }
      events.forEach((eventStack) => {
        if (eventStack.judgeFunc) {
          const preData = eventStack.judgeFunc(e);
          if (preData !== false) {
            isFirst = false;
            innerFuncArr.push((e: MouseEvent) => {
              eventStack.innerFunc(e, preData);
            });
          } else {
            if (eventStack.outerFunc) {
              outerFuncArr.push(eventStack.outerFunc);
            }
          }
        }
        return false;
      });
    });
    outerFuncArr.flat().forEach((fn) => fn(e));
    innerFuncArr.flat().forEach((fn) => fn(e));
  }
}
