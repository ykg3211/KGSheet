import { EventConstant, RightClickPanelConstant } from '../core/plugins/base/event';
import { PluginTypeEnum } from '../core/plugins';
import Base from '../core/base/base';
import { BasePanelType, RightClickPanelType } from './interface';

interface Position {
  x: number;
  y: number;
}

export default class RightClickPanelPlugin {
  public name: string;
  private _this: Base;
  private position: null | Position;

  constructor(_this: Base) {
    this.name = PluginTypeEnum.RightClickPanelPlugin;
    this._this = _this;
    this.position = null;
    this.initEvent();
  }

  private initEvent() {
    this._this.on(EventConstant.RIGHT_CLICK, (e) => {
      this.createPanel(e);
    });
  }

  public createPanel(e: MouseEvent | undefined) {
    if (!e) {
      return;
    }
    const originPosition = {
      x: e.pageX,
      y: e.pageY,
    };
    this.position = originPosition;
    const point = this._this.transformXYInContainer(e);
    if (!point) {
      return false;
    }

    this._this.devMode && console.log('RightClick');
    this.handleCell(point, originPosition);
  }

  private createBaseConfig({ x, y }: Position): BasePanelType {
    return {
      x,
      y,
      darkMode: false,
    };
  }

  private handleCell(point: [number, number], originPosition: Position) {
    console.log(point);
    const cell = this._this.getCellByPoint(point);

    console.log(cell);
    if (!cell || (cell.column === -1 && cell.row === -1)) {
      return;
    }
    if (cell?.column === -1) {
      this.handleLeftBar(originPosition);
      return;
    }
    if (cell?.column === -1) {
      this.handleTopBar(originPosition);
      return;
    }
    this._this.emit(RightClickPanelConstant.SHOW_PANEL, {
      type: RightClickPanelType.CELL,
      ...this.createBaseConfig(originPosition),
    });
  }

  private handleLeftBar(position: Position) {
    this._this.emit(RightClickPanelConstant.SHOW_PANEL, {
      type: RightClickPanelType.LEFT_BAR,
      ...this.createBaseConfig(position),
    });
  }

  private handleTopBar(position: Position) {
    this._this.emit(RightClickPanelConstant.SHOW_PANEL, {
      type: RightClickPanelType.TOP_BAR,
      ...this.createBaseConfig(position),
    });
  }
}
