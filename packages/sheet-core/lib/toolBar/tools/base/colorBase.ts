import { ToolsProps } from '../../interface';
import { BaseTool, ToolTypeEnum } from '.';

const translateColor = (colors: string[]) => {
  return colors.map((item) => {
    return (
      '#' +
      item
        .split(',')
        .map(Number)
        .map((num) => {
          const v = num.toString(16);
          if (v.length === 1) {
            return '0' + v;
          }
          return v;
        })
        .join('')
    );
  });
};

const DefaultColors = [
  ['#ffffff', '#DEE0E3', '#8F959E', '#373C43', '#1F2329'],
  ['#e1eaff', '#bacefd', '#3370ff', '#245bdb', '#133c9a'],
  ['#d9f3fd', '#7edafb', '#049fd7', '#037eaa', '#006185'],
  ['#d5f6f2', '#64e8d6', '#04b49c', '#036356', '#024b41'],
  ['#d9f5d6', '#8ee085', '#2ea121', '#186010', '#124b0c'],
  ['#eef6c6', '#c3dd40', '#8fac02', '#667901', '#495700'],
  ['#faf1d1', '#fad355', '#ffc60a', '#dc9b04', '#795101'],
  ['#fed4a4', '#ffba6b', '#de7802', '#8f4f04', '#6b3900'],
  ['#fbbfbc', '#f76964', '#d83931', '#812520', '#621c18'],
  ['#fdddef', '#f57ac0', '#f01d94', '#9e1361', '#7a0f4b'],
  ['#ece2fe', '#ad82f7', '#6425d0', '#380d82', '#270561'],
];

export default class ColorBase extends BaseTool {
  public isActive: boolean; // 是用来存储是不是被触发的， 用于一些样式按钮。
  public colorStores: Array<Array<string>>;

  constructor(props: ToolsProps) {
    super(props);
    this.type = ToolTypeEnum.COLOR;
    this.isActive = false;

    this.colorStores = DefaultColors;
  }
}
