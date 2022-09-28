export const EventConstant = {
  'DESTROY': 'destroy'
}

export default class BaseEvent {
  protected deps: Record<string, (() => void)[]>;
  constructor() {
    this.deps = {};
  }

  on(name: string, func: () => void) {
    if (this.deps[name]) {
      this.deps[name].push(func);
    } else {
      this.deps[name] = [func];
    }
  }

  once(name: string, func: () => void) {
    const _func = () => {
      func();
      this.un(name, _func)
    }
    if (this.deps[name]) {
      this.deps[name].push(_func);
    } else {
      this.deps[name] = [_func];
    }
  }

  un(name?: string, func?: () => void) {
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

  emit(name: string) {
    if (this.deps[name]) {
      this.deps[name].forEach(fn => fn());
    }
  }
}