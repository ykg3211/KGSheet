import { ShowPanelProps } from '../RightClickPanel/interface';
import { CellCornerScopeType } from '../SelectAndInput/EditCellPlugin';

export enum ToolsEventConstant {
  REFRESH = 'refresh',
  REFRESH_ATTRIBUTES_STATE = 'refresh_attributes_state',
  DUPLICATE_STYLE_STATE_CHANGE = 'duplicate_style_state_change',
  TOGGLE_CELL_BORDER = 'toggle_draw_cell_border',
}
export enum RightClickPanelConstant {
  SHOW_PANEL = 'show_panel',
  HIDE_PANEL = 'hide_panel',
}
export enum EventConstant {
  RENDER = 'render',
  EXCEL_CHANGE = 'excel_change',
  DARK_MODE_CHANGE = 'dark_mode_change',
  DESTROY = 'destroy',
  DB_CLICK = 'dblclick',
  RIGHT_CLICK = 'rightClick',
  CLICK = 'click',
  SCALE_CHANGE = 'scale_change',
  MOUSE_DOWN = 'mouse_down',
  MOUSE_UP = 'mouse_up',
  MOUSE_MOVE = 'mouse_move',
  TOUCH_START = 'touch_start',
  TOUCH_END = 'touch_end',
  TOUCH_MOVE = 'touch_move',
  RESIZE = 'resize',
  MOUSE_HOVER_EVENT = 'mouse_hover_event',
  SELECT_CELL_MOVE_TO_VIEW = 'select_cell_move_to_view',
  BLUR_FOCUS_RESET_PARAMS = 'blur_focus_reset_params',
  SELECT_CELLS_CHANGE = 'select_cells_change',
}
export enum BusinessEventConstant {
  MSG_BOX = 'message_box',
}

type EventParamsTypes = {
  [EventConstant.SELECT_CELLS_CHANGE]: CellCornerScopeType | undefined;
  [EventConstant.RIGHT_CLICK]: MouseEvent;
  [EventConstant.DARK_MODE_CHANGE]: boolean;
  [EventConstant.SCALE_CHANGE]: number;
  [EventConstant.BLUR_FOCUS_RESET_PARAMS]: boolean;
  [RightClickPanelConstant.SHOW_PANEL]: ShowPanelProps;
  [ToolsEventConstant.TOGGLE_CELL_BORDER]: boolean;
  [ToolsEventConstant.DUPLICATE_STYLE_STATE_CHANGE]: boolean;
  [BusinessEventConstant.MSG_BOX]: { type: 'info' | 'success' | 'error' | 'warning'; message: string };
};

type EventParamsAllTypes = EventParamsTypes &
  Omit<Record<EventConstant, any>, keyof EventParamsTypes> &
  Omit<Record<RightClickPanelConstant, any>, keyof EventParamsTypes> &
  Omit<Record<ToolsEventConstant, any>, keyof EventParamsTypes> &
  Omit<Record<BusinessEventConstant, any>, keyof EventParamsTypes>;

type EventNameType = EventConstant | BusinessEventConstant | ToolsEventConstant | RightClickPanelConstant;
type EventParamsType<T extends EventNameType> = EventParamsAllTypes[T];

export default class BaseEvent {
  protected deps: Record<string, ((data?: any) => void | any)[]>;

  constructor() {
    this.deps = {};
  }

  on<T extends EventNameType>(name: T, func: (data?: EventParamsType<T>) => void | any) {
    if (this.deps[name]) {
      this.deps[name].push(func);
    } else {
      this.deps[name] = [func];
    }
  }

  once<T extends EventNameType>(name: T, func: (data?: EventParamsType<T>) => void | any) {
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

  un<T extends EventNameType>(name?: T, func?: (data?: EventParamsType<T>) => void | any) {
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

  emit<T extends EventNameType>(name: T, data?: EventParamsType<T>) {
    if (this.deps[name]) {
      this.deps[name].forEach((fn) => fn(data));
    }
  }
}
