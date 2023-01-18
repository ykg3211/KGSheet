import { EventConstant, ToolsEventConstant } from '../../../core/plugins/base/event';
import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '../base';

interface BaseType {
  toolTip: string;
  icon: string;
  label: string;
}

export class ZoomBar extends BaseTool {
  public value: number;
  public up: BaseType;
  public down: BaseType;
  public zoomOptions: number[];

  constructor(props: ToolsProps) {
    super(props);
    this.value = +(this.sheet.scale * 100).toFixed();
    this.type = ToolTypeEnum.ZOOM;
    this.zoomOptions = [200, 150, 125, 100, 75, 50, 20];
    this.up = {
      toolTip: '放大',
      icon: 'sheet-iconadd-bold',
      label: '放大',
    };
    this.down = {
      toolTip: '缩小',
      icon: 'sheet-iconminus-bold',
      label: '缩小',
    };
    this.initEvent();
  }

  private initEvent() {
    const that = this;
    this.sheet.on(EventConstant.SCALE_CHANGE, (v = 1) => {
      that.value = +(v * 100).toFixed();
      that.toolBar.emit(ToolsEventConstant.REFRESH);
    });
  }

  public click(isUp?: boolean): void {
    const newV = +(this.value / 10).toFixed() * 10 + (isUp ? 10 : -10);
    this.sheet.scale = newV / 100;
    this.value = +(this.sheet.scale * 100).toFixed();
    this.toolBar.emit(ToolsEventConstant.REFRESH);
  }

  public selectZoom(zoom: number) {
    this.value = zoom;
    this.sheet.scale = zoom / 100;
    this.toolBar.emit(ToolsEventConstant.REFRESH);
  }
}
