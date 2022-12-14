import Base from '../../base';
import { ToolsPluginTypeEnum } from '..';
import { EventConstant, ToolsEventConstant } from '../../../core/plugins/base/event';
import { PluginTypeEnum } from '../../../core/plugins';
import { CellStyle } from '../../../interfaces';
import { NOT_SAME } from '../../../core/plugins/FontEditPlugin';
import { ToolsEnum } from '../../../toolBar/tools';
import { CellCornerScopeType } from '../../../core/plugins/SelectAndInput/EditCellPlugin';

export default class UpdateState {
  public name: string;
  private _this: Base;

  constructor(_this: Base) {
    this.name = ToolsPluginTypeEnum.UpdateState;
    this._this = _this;

    this.initEvent();
  }

  private initEvent() {
    const sheet = this._this.sheet;
    sheet.on(EventConstant.SELECT_CELLS_CHANGE, this.refreshToolsState.bind(this));
    this._this.on(ToolsEventConstant.REFRESH_ATTRIBUTES_STATE, () => {
      const SelectCellsScope = sheet.getPlugin(PluginTypeEnum.SelectPowerPlugin)?.getSelectCellsScope();
      if (SelectCellsScope) {
        this.refreshToolsState(SelectCellsScope);
      }
    });
  }

  public refreshToolsState(cells: CellCornerScopeType | undefined) {
    const sheet = this._this.sheet;
    const FontEditPlugin = sheet.getPlugin(PluginTypeEnum.FontEditPlugin);
    if (!cells || !FontEditPlugin) {
      return;
    }

    const { data: sourceData } = sheet.getDataByScope(cells);

    const preAttributes = FontEditPlugin.getSameAttributes(sourceData, cells);
    this.dispatchAttributes(preAttributes);

    sheet.emit(ToolsEventConstant.REFRESH);
  }

  private dispatchAttributes(preAttributes: CellStyle | Record<keyof CellStyle, 'not_same'>) {
    console.log('preAttributes: 计算tools上的按钮的状态', preAttributes);
    const toolBar = this._this;

    // deleteLine
    toolBar.getTool(ToolsEnum.FONT_DELETE_LINE).active =
      preAttributes.deleteLine !== NOT_SAME && !!preAttributes.deleteLine;

    // TEXT_ALIGN_LEFT
    toolBar.getTool(ToolsEnum.TEXT_ALIGN_LEFT).active = preAttributes.textAlign === 'left';
    // TEXT_ALIGN_CENTER
    toolBar.getTool(ToolsEnum.TEXT_ALIGN_CENTER).active = preAttributes.textAlign === 'center';
    // TEXT_ALIGN_RIGHT
    toolBar.getTool(ToolsEnum.TEXT_ALIGN_RIGHT).active = preAttributes.textAlign === 'right';
  }

  public remove() {
    const sheet = this._this.sheet;
    sheet.un(EventConstant.SELECT_CELLS_CHANGE);
  }
}
