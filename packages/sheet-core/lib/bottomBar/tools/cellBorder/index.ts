import { ToolsEventConstant } from '../../../core/plugins/base/event';
import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';

export class CellBorder extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.handleLabel();
    this.initEvent();
  }

  private initEvent() {
    const refresh = () => {
      this.bottomBar.emit(ToolsEventConstant.REFRESH);
    };
    this.sheet.on(ToolsEventConstant.TOGGLE_CELL_BORDER, refresh);
  }

  public handleLabel() {
    this.active = !this.sheet.drawCellBorder;
    this.toolTip = '显示网格线';
    this.icon = this.active ? 'sheet-icona-bottomframe' : 'sheet-icona-bottomframe';
    this.label = this.active ? '隐藏网格线' : '显示网格线';
  }

  public click() {
    this.sheet.drawCellBorder = !this.sheet.drawCellBorder;
    this.handleLabel();
  }
}
