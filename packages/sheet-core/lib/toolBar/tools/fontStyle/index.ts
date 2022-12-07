import { META_KEY } from '../../../utils';
import { ToolsProps } from '../../interface';
import ButtonBase from '../base/buttonBase';
import OptionBase from '../base/optionBase';

export class FontSize extends OptionBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '字号';
    this.toolTip = '字号';
    this.options = [9, 10, 11, 12, 14, 18, 24, 30, 36].map((num) => ({
      label: num + '',
      value: num + '',
    }));
    this.value = '12';
    this.width = 62;
  }

  public click() {
    //
  }
}

export class FontColor extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '清除格式';
    this.toolTip = '清除格式';
    this.icon = 'sheet-iconerase';
  }

  public click() {
    this.sheet.clearStyle();
  }
}

export class FontWeight extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '加粗';
    this.toolTip = `加粗(${META_KEY}+B)`;
    this.icon = 'sheet-iconbold';
  }

  public click() {
    this.sheet.blodStyle();
  }
}
export class FontDeleteLine extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '删除线';
    this.toolTip = `删除线(${META_KEY}+Shift+X)`;
    this.icon = 'sheet-icona-deleteline';
  }

  public click() {
    this.sheet.deleteLine();
  }
}
export class FontItalic extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '斜体';
    this.toolTip = `斜体(${META_KEY}+I)`;
    this.icon = 'sheet-iconitalics';
  }

  public click() {
    this.sheet.italic();
  }
}
export class FontUnderLine extends ButtonBase {
  constructor(props: ToolsProps) {
    super(props);
    this.label = '下划线';
    this.toolTip = `下划线(${META_KEY}+U)`;
    this.icon = 'sheet-iconunderline';
  }

  public click() {
    this.sheet.underLine();
  }
}
