import { ToolsProps } from '../../interface';

export class BaseTool {
  protected sheet: ToolsProps['sheet'];
  protected toolBar: ToolsProps['toolBar'];
  public icon: string;
  public label: string;
  public toolTip: string;
  public key: string;
  public class: string;
  public style: Partial<CSSStyleDeclaration>;

  constructor({ sheet, toolBar, key }: ToolsProps) {
    this.sheet = sheet;
    this.toolBar = toolBar;
    this.key = key;
    this.icon = '';
    this.label = '';
    this.toolTip = '';
    this.class = '';
    this.style = {};
  }

  public click() {}
}
