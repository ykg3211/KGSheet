import Excel from '@/core';
import { BaseToolType, ToolsProps } from '@/toolBar/interface';

export class Revert implements BaseToolType {
  private sheet: ToolsProps['sheet'];
  private toolBar: ToolsProps['toolBar'];
  public icon: string;
  public label: string;
  public key: string;

  constructor({ sheet, toolBar, key }: ToolsProps) {
    this.sheet = sheet;
    this.toolBar = toolBar;
    this.label = '';
    this.icon = 'UndoOutlined';
    this.key = key;
  }

  public click() {
    console.log('Revert');
    this.sheet.reverse();
  }
}

export class AntiRevert implements BaseToolType {
  private sheet: ToolsProps['sheet'];
  private toolBar: ToolsProps['toolBar'];
  public icon: string;
  public label: string;
  public key: string;

  constructor({ sheet, toolBar, key }: ToolsProps) {
    this.sheet = sheet;
    this.toolBar = toolBar;
    this.label = '';
    this.icon = 'RedoOutlined';
    this.key = key;
  }

  public click() {
    console.log('AntiRevert');
    this.sheet.anti_reverse();
  }
}
