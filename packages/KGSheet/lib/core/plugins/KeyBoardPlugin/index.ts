import { PluginTypeEnum } from "..";
import Base from "../../base/base";
import { deepClone } from "../../../utils";
import { BASE_KEYS, BASE_KEYS_ENUM } from './constant';


interface KeyBoardEvent {
  op?: 'and' | 'or',
  baseKeys?: string[],
  mainKeys: string | string[],
  callbacks: Array<(e: KeyboardEvent, v: Omit<KeyBoardEventDev, 'callback'>) => void>
}


interface KeyBoardEventDev {
  baseKeys: string[],
  mainKeys: string,
  callbacks: Array<(e: KeyboardEvent, v: Omit<KeyBoardEventDev, 'callback'>) => void>
}


export default class KeyBoardPlugin {
  private _this: Base;
  public name: string;
  private baseKeyDownListener: (e: KeyboardEvent) => void;
  private baseKeyUpListener: (e: KeyboardEvent) => void;
  private devs: Record<string, Record<string, KeyBoardEventDev>>;
  public OperateState: Record<BASE_KEYS_ENUM, boolean>;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.KeyBoardPlugin;
    this._this = _this;
    this.initState();
    this.devs = {};

    this.baseKeyDownListener = this._baseKeyDownListener.bind(this);
    this.baseKeyUpListener = this._baseKeyUpListener.bind(this);
    document.body.addEventListener('keydown', this.baseKeyDownListener)
    document.body.addEventListener('keyup', this.baseKeyUpListener)
    this.windowBlur();
  }

  private windowBlur() {
    window.onblur = () => {
      Object.keys(this.OperateState).forEach(key => {
        this.OperateState[key] = false;
      })
    }
    window.onfocus = () => {
      Object.keys(this.OperateState).forEach(key => {
        this.OperateState[key] = false;
      })
    }
  }

  private initState() {
    this.OperateState = deepClone(BASE_KEYS);
    Object.keys(this.OperateState).forEach(key => {
      this.OperateState[key] = false;
    })
  }

  private remove() {
    document.body.removeEventListener('keydown', this.baseKeyDownListener)
  }

  public uninstall({
    op = 'and',
    baseKeys,
    mainKeys,
    callbacks,
  }: KeyBoardEvent) {
    if (!baseKeys) {
      return;
    }
    const key = baseKeys.length === 0 ? '.' : baseKeys.sort().join('_');
    if (!this.devs[key]) {
      return;
    }

    if (!(mainKeys instanceof Array)) {
      mainKeys = [mainKeys]
    }
    mainKeys.forEach(k => {
      if (this.devs[key][k]) {
        this.devs[key][k].callbacks = this.devs[key][k].callbacks.filter(cb => !callbacks.includes(cb))
      }
    })
  }

  public register({
    op = 'and',
    baseKeys,
    mainKeys,
    callbacks,
  }: KeyBoardEvent) {
    if (!baseKeys) {
      baseKeys = [];
    }
    const key = baseKeys.length === 0 ? '.' : baseKeys.sort().join('_');
    if (!this.devs[key]) {
      this.devs[key] = {};
    }

    if (!(mainKeys instanceof Array)) {
      mainKeys = [mainKeys]
    }

    mainKeys.forEach(k => {
      if (this.devs[key][k]) {
        this.devs[key][k].callbacks = this.devs[key][k].callbacks.concat(callbacks)
      } else {
        this.devs[key][k] = {
          baseKeys: baseKeys || [],
          mainKeys: k,
          callbacks: callbacks
        };
      }
    })
  }

  private dispatch(e: KeyboardEvent) {
    const key = e.key;
    const states: string[] = [];
    Object.keys(this.OperateState).forEach(k => {
      if (this.OperateState[k]) {
        states.push(k);
      }
    })
    const baseKey = states.length === 0 ? '.' : states.sort().join('_');
    if (this.devs[baseKey] && this.devs[baseKey][key]) {
      this.devs[baseKey][key].callbacks.forEach(cb => {
        cb(e, {
          baseKeys: states,
          mainKeys: key,
        });
      })
    }
  }

  private _baseKeyDownListener(e: KeyboardEvent) {
    if (BASE_KEYS[e.key]) {
      this.OperateState[e.key] = true;
    } else {
      this.dispatch(e);
    }
  }

  private _baseKeyUpListener(e: KeyboardEvent) {
    if (BASE_KEYS[e.key]) {
      this.OperateState[e.key] = false;
    }
  }
}