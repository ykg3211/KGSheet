import { ToolsEventConstant } from '../../../core/plugins/base/event';
import { META_KEY } from '../../../utils';
import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';
import OptionBase, { OptionsType } from '../base/optionBase';

export class TextAlignLeft extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '向左对齐';
    this.toolTip = '向左对齐';
    this.icon = 'sheet-icona-alignleft';
  }

  public click() {
    this.sheet.textAlign('left');
    this.toolBar.emit(ToolsEventConstant.REFRESH_ATTRIBUTES_STATE);
  }
}

export class TextAlignCenter extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '中心对齐';
    this.toolTip = `中心对齐`;
    this.icon = 'sheet-iconcentre';
  }

  public click() {
    this.sheet.textAlign('center');
    this.toolBar.emit(ToolsEventConstant.REFRESH_ATTRIBUTES_STATE);
  }
}
export class TextAlignRight extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '向右对齐';
    this.toolTip = `向右对齐`;
    this.icon = 'sheet-icona-alignright';
  }

  public click() {
    this.sheet.textAlign('right');
    this.toolBar.emit(ToolsEventConstant.REFRESH_ATTRIBUTES_STATE);
  }
}
