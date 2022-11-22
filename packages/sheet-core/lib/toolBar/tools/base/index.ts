import { BaseToolType, ToolsProps } from '../../interface';

export class BaseTool {
  protected sheet: ToolsProps['sheet'];
  protected toolBar: ToolsProps['toolBar'];
  protected icon: string;
  protected label: string;
  protected key: string;
  protected class: string;
  protected style: Partial<CSSStyleDeclaration>;

  constructor({ sheet, toolBar, key }: ToolsProps) {
    this.sheet = sheet;
    this.toolBar = toolBar;
    this.key = key;
    this.icon = '';
    this.label = '';
    this.class = '';
    this.style = {};
  }

  public click() {}
}
