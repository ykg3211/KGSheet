export enum EventConstant {
  RENDER = 'render',
  EXCEL_CHANGE = 'excel_change',
  DARK_MODE_CHANGE = 'dark_mode_change',
  DESTROY = 'destroy',
  DB_CLICK = 'dblclick',
  CLICK = 'click',
  SCALE_CHANGE = 'scale_change',
  MOUSE_DOWN = 'mouse_down',
  MOUSE_UP = 'mouse_up',
  MOUSE_MOVE = 'mouse_move',
  TOUCH_START = 'touch_start',
  TOUCH_END = 'touch_end',
  TOUCH_MOVE = 'touch_move',
  MOUSE_HOVER_EVENT = 'mouse_hover_event',
  SELECT_CELL_MOVE_TO_VIEW = 'select_cell_move_to_view',
  BLUR_FOCUS_RESET_PARAMS = 'blur_focus_reset_params',
}

export enum BusinessEventConstant {
  MSG_BOX = 'message_box',
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
      this.un(name, _func);
    };
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
      this.deps[name] = this.deps[name].filter((fn) => fn !== func);
    } else {
      delete this.deps[name];
    }
  }

  emit(name: string, data?: any) {
    if (this.deps[name]) {
      this.deps[name].forEach((fn) => fn(data));
    }
  }
}
