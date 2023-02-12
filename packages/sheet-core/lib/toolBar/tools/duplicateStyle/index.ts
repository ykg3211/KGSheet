import { PluginTypeEnum } from '../../../core/plugins';
import { ToolsEventConstant } from '../../../core/plugins/base/event';
import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';

export class DuplicateStyle extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '格式刷';
    this.toolTip = '格式刷';
    this.icon = 'sheet-iconpaint-format-remove';
    this.active = false;

    this.initEvent();
  }
  private initEvent() {
    this.sheet.on(ToolsEventConstant.DUPLICATE_STYLE_STATE_CHANGE, (state) => {
      this.active = !!state;
      this.sheet.emit(ToolsEventConstant.REFRESH);
    });
  }

  public click() {
    this.sheet.getPlugin(PluginTypeEnum.DuplicateStyle)?.startDuplicateStyle();
  }
}
