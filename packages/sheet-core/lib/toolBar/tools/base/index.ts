import { ToolsProps } from '../../interface';

export enum ToolTypeEnum {
  BUTTON = 'button',
  OPTION = 'option',
}

export class BaseTool {
  protected sheet: ToolsProps['sheet'];
  protected toolBar: ToolsProps['toolBar'];
  public type!: ToolTypeEnum;
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

  public click(v?: any) {}
}
