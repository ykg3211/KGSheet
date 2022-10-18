import { PluginTypeEnum } from "..";
import Base from "../../base/base";
import { deepClone } from "../../../utils";
import { BASE_KEYS, BASE_KEYS_ENUM } from './constant';

interface KeyBoardEvent {
  baseKeys?: string[],
  mainKeys: string | string[],
  callback: Array<(e: KeyboardEvent, v: Omit<KeyBoardEventDev, 'callback'>) => void>
}


interface KeyBoardEventDev {
  baseKeys: string[],
  mainKeys: string,
  callback: Array<(e: KeyboardEvent, v: Omit<KeyBoardEventDev, 'callback'>) => void>
}


export default class KeyBoardPlugin {
  private _this: Base;
  public name: string;
  private baseKeyDownListener: (e: KeyboardEvent) => void;
  private baseKeyUpListener: (e: KeyboardEvent) => void;
  private devs: Record<string, Record<string, KeyBoardEventDev>>;
  private OperateState: Record<BASE_KEYS_ENUM, boolean>;

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

  public register(e: KeyBoardEvent) {
    if (!e.baseKeys) {
      e.baseKeys = [];
    }
    const key = e.baseKeys.length === 0 ? '.' : e.baseKeys.sort().join('_');
    if (!this.devs[key]) {
      this.devs[key] = {};
    }

    if (!(e.mainKeys instanceof Array)) {
      e.mainKeys = [e.mainKeys]
    }

    e.mainKeys.forEach(k => {
      if (this.devs[key][k]) {
        this.devs[key][k].callback = this.devs[key][k].callback.concat(e.callback)
      } else {
        this.devs[key][k] = {
          baseKeys: e.baseKeys || [],
          mainKeys: k,
          callback: e.callback
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
      this.devs[baseKey][key].callback.forEach(cb => {
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