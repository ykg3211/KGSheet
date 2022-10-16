import { PluginTypeEnum } from "..";
import Base from "../../base/base";
import { BaseCellsChangeEventStackType } from ".";
import KeyBoardPlugin from "../KeyBoardPlugin";
import { BASE_KEYS_ENUM, OPERATE_KEYS_ENUM } from "../KeyBoardPlugin/constant";

export interface BaseEventType<T = BaseCellsChangeEventStackType> {
  params: T,
  func: (p: T, isReverse?: boolean) => void,
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
    // const a = document.createElement('div');
    // a.innerHTML = 'reverse';
    // a.onclick = this.reverse.bind(this);
    // const b = document.createElement('div');
    // b.innerHTML = 'anti_reverse';
    // b.onclick = this.anti_reverse.bind(this);

    // document.getElementById('tools').appendChild(a)
    // document.getElementById('tools').appendChild(b)
  }

  private initPlugin() {
    if (this._this[PluginTypeEnum.KeyBoardPlugin]) {
      this.KeyboardPlugin = this._this[PluginTypeEnum.KeyBoardPlugin]

      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Shift, BASE_KEYS_ENUM.Meta],
        mainKeys: 'z',
        callback: [() => {
          this.anti_reverse()
        }]
      })
      this.KeyboardPlugin.register({
        baseKeys: [BASE_KEYS_ENUM.Meta],
        mainKeys: 'z',
        callback: [() => {
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