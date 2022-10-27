import { PluginTypeEnum } from "..";
import Base from "../../base/base";
import { BaseCellsChangeEventStackType, RowColumnResizeType } from ".";
import KeyBoardPlugin from "../KeyBoardPlugin";
import { BASE_KEYS_ENUM, OPERATE_KEYS_ENUM } from "../KeyBoardPlugin/constant";

type BaseEvent = RowColumnResizeType | BaseCellsChangeEventStackType;
export interface BaseEventType {
  params: BaseEvent,
  func: (p: BaseEvent, isReverse?: boolean) => void,
}

// (this[EventType.CELLS_CHANGE])(1)

export default class BaseEventStack {
  private EVENT_STACK: BaseEventType[][];
  private REVERSE_STACK: BaseEventType[][];
  public _this: Base;
  public name: string;
  private KeyboardPlugin: KeyBoardPlugin;

  constructor(_this: Base) {
    this._this = _this;
    this.name = PluginTypeEnum.EventStack;

    this.EVENT_STACK = [];
    this.REVERSE_STACK = [];

    this.initPlugin();
  }

  private initPlugin() {
    if (this._this[PluginTypeEnum.KeyBoardPlugin]) {
      this.KeyboardPlugin = this._this[PluginTypeEnum.KeyBoardPlugin]

      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Shift, BASE_KEYS_ENUM.Meta],
        mainKeys: ['z', 'Z'],
        callbacks: [() => {
          this.anti_reverse()
        }]
      })
      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Meta],
        mainKeys: ['z', 'Z'],
        callbacks: [() => {
          this.reverse()
        }]
      })
    }
  }

  public push(events: BaseEventType[], immediate = true) {
    this.REVERSE_STACK = [];
    events.forEach(event => {
      if (immediate) {
        event.func?.(event.params);
      }
    })
    this.EVENT_STACK.push(events);
  }

  public reverse() {
    const pres = this.EVENT_STACK.pop();
    if (pres) {
      for (let i = pres.length - 1; i >= 0; i--) {
        const pre = pres[i];
        pre.func?.(pre.params, true);
      }
      this.REVERSE_STACK.push(pres);
    }
  }

  public anti_reverse() {
    const pres = this.REVERSE_STACK.pop();
    if (pres) {
      pres.forEach(pre => {
        pre.func(pre.params);
      })
      this.EVENT_STACK.push(pres);
    }
  }
}