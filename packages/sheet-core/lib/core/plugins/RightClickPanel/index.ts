import { EventConstant, RightClickPanelConstant } from '../base/event';
import { PluginTypeEnum } from '..';
import Base from '../../base/base';
import { BasePanelType, RightClickPanelType } from './interface';
import { clickOutSide } from '../../../utils';

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

    document.body.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        return;
      }
      if (clickOutSide('kgsheet_panel', e)) {
        this._this.emit(RightClickPanelConstant.HIDE_PANEL);
      }
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

  private handleCell(point: [number, number], originPosition: Position) {
    const cell = this._this.getCellByPoint(point);

    console.log(cell);
    if (!cell || (cell.column === -1 && cell.row === -1)) {
      return;
    }
    if (cell?.column === -1) {
      this.handleSideBar(originPosition, false);
      return;
    }
    if (cell?.column === -1) {
      this.handleSideBar(originPosition, true);
      return;
    }
    this._this.emit(RightClickPanelConstant.SHOW_PANEL, {
      type: RightClickPanelType.CELL,
      ...this.createPanelPostion(originPosition),
      ...this.createBaseConfig(RightClickPanelType.CELL),
    });
  }

  private handleSideBar(position: Position, isTop = true) {
    const type = isTop ? RightClickPanelType.TOP_BAR : RightClickPanelType.LEFT_BAR;
    this._this.emit(RightClickPanelConstant.SHOW_PANEL, {
      type,
      ...this.createPanelPostion(position),
      ...this.createBaseConfig(type),
    });
  }

  private createPanelPostion({ x, y }: Position): BasePanelType {
    return {
      x,
      y,
      darkMode: false,
    };
  }

  private createBaseConfig(type: RightClickPanelType) {
    return {};
  }
}
