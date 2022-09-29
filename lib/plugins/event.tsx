export enum EventConstant {
  DESTROY = 'destroy',
  CLICK = 'click',
  MOUSE_DOWN = 'mouse_down',
  MOUSE_UP = 'mouse_up',
  MOUSE_MOVE = 'mouse_move',
  MOUSE_HOVER_EVENT = 'mouse_hover_event',
}

export default class BaseEvent {
  protected deps: Record<string, ((data?: any) => void)[]>;
  constructor() {
    this.deps = {};
  }

  on(name: string, func: (data?: any) => void) {
    if (this.deps[name]) {
      this.deps[name].push(func);
    } else {
      this.deps[name] = [func];
    }
  }

  once(name: string, func: (data?: any) => void) {
    const _func = (data: any) => {
      func(data);
      this.un(name, _func)
    }
    if (this.deps[name]) {
      this.deps[name].push(_func);
    } else {
      this.deps[name] = [_func];
    }
  }

  un(name?: string, func?: (data?: any) => void) {
    if (!name) {
      this.deps = {};
      return;
    }
    if (func) {
      this.deps[name] = this.deps[name].filter(fn => fn !== func);
    } else {
      delete this.deps[name];
    }
  }

  emit(name: string, data?: any) {
    if (this.deps[name]) {
      this.deps[name].forEach(fn => fn(data));
    }
  }
}