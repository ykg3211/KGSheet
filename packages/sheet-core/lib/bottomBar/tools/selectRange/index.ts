import { EventConstant, ToolsEventConstant } from '../../../core/plugins/base/event';
import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '../base';

export class SelectRange extends BaseTool {
  public rows: number;
  public columns: number;

  constructor(props: ToolsProps) {
    super(props);
    this.type = ToolTypeEnum.SELECT_RANGE;
    this.rows = 0;
    this.columns = 0;
    this.initEvent();
  }

  private initEvent() {
    this.sheet.on(EventConstant.SELECT_CELLS_CHANGE, (selected) => {
      if (!selected) {
        return;
      }
      const { leftTopCell, rightBottomCell } = selected;
      this.rows = rightBottomCell.row - leftTopCell.row + 1;
      this.columns = rightBottomCell.column - leftTopCell.column + 1;
      this.bottomBar.emit(ToolsEventConstant.REFRESH);
    });
  }
}
