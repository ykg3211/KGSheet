import Base from '../../base';
import { ToolsPluginTypeEnum } from '..';
import { EventConstant, ToolsEventConstant } from '../../../core/plugins/base/event';

export default class ShadowInput {
  public name: string;
  private _this: Base;

  constructor(_this: Base) {
    this.name = ToolsPluginTypeEnum.ShadowInput;
    this._this = _this;
    this.initEvent();
  }

  private initEvent() {
    this._this.sheet.on(EventConstant.SELECT_CELLS_CHANGE, (selectedCells) => {
      if (selectedCells) {
        const cell = this._this.sheet.getRealCell(selectedCells.leftTopCell);
        this._this.emit(ToolsEventConstant.SET_SHADOW_INPUT, cell.content);
      }
    });
  }
}
