// @ts-noc heck
// 类型值和方法是protected，插件能用到但是会报错，所以插件都不提示

import BaseMap from "../core/base/baseMap";
import judgeHover from "../utils/judgeHover";

export type scope = [number, number, number, number];
export interface eventStackType {
  id: string;
  scope: scope;
  innerFunc: () => void;
  outerFunc?: () => void;
}

export default class EventStack {
  private eventStack: Record<string, eventStackType>;

  constructor() {
    this.eventStack = {};
  }

  protected addEvent(props: eventStackType) {
    this.eventStack[props.id] = props;
  }

  protected dispatchEvent(point: [number, number]) {
    const stashFunc: (() => void)[] = [];
    Object.values(this.eventStack).forEach(item => {
      item.outerFunc?.();
      if (judgeHover(point, item.scope)) {
        stashFunc.push(item.innerFunc);
      }
    })

    stashFunc.forEach(fn => fn())
  }
}