import { ToolsProps } from '../../interface';
import ColorBase from '../base/colorBase';

export class FontColor extends ColorBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '字体颜色';
    this.toolTip = '字体颜色';
    this.icon = 'sheet-icona-fontcolor';
  }

  public click(v: string): void {
    this.value = v;
    this.pushRecent(v);
    this.sheet.changeColor(v, true);
  }

  // public changeColor(v: string) {
  //   this.baseChangeColor(v);
  //   // this.sheet.changeColor(v, true);
  // }
}

export class BackgroundColor extends ColorBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '背景颜色';
    this.toolTip = '背景颜色';
    this.icon = 'sheet-icona-bgcolor';
  }

  public click(v: string): void {
    this.value = v;
    this.pushRecent(v);
    this.sheet.changeColor(v, false);
  }

  // public changeColor(v: string) {
  //   this.baseChangeColor(v);
  //   // this.sheet.changeColor(v, false);
  // }
}
