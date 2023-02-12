import { ToolsProps } from '../../interface';
import { throttle } from '../../../utils';
import { BaseTool, ToolTypeEnum } from '.';
import { EventConstant, ToolsEventConstant } from '../../../core/plugins/base/event';
import { ColorType } from '../../../core/base/drawLayer';

// const translateColor = (colors: string[]) => {
//   return colors.map((item) => {
//     return (
//       '#' +
//       item
//         .split(',')
//         .map(Number)
//         .map((num) => {
//           const v = num.toString(16);
//           if (v.length === 1) {
//             return '0' + v;
//           }
//           return v;
//         })
//         .join('')
//     );
//   });
// };
const DefaultColors = [
  ['#ffffff', '#dee0e3', '#8f959e', '#373c43', '#0a0c0b'],
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

const toggleArray = (arr: any[][]) => {
  const result: any[][] = [];
  const maxLength = arr.reduce((length, subArr) => {
    return Math.max(subArr.length, length);
  }, 0);
  let i = 0;
  while (i < maxLength) {
    const temp: any[] = [];
    arr.forEach((subArr) => {
      temp.push(subArr[i]);
    });
    result.push(temp);
    i++;
  }
  return result;
};

export default class ColorBase extends BaseTool {
  public isActive: boolean; // 是用来存储是不是被触发的， 用于一些样式按钮。
  public colorStore: Array<Array<string>>;
  public recentColorStore: Array<string>;
  public value: string;
  public maxRecent: number;
  private refreshTool: () => void;

  constructor(props: ToolsProps) {
    super(props);
    this.type = ToolTypeEnum.COLOR;
    this.isActive = false;
    this.recentColorStore = [];
    this.value = this.sheet.getColor(ColorType.black);
    this.initDarkModeChange();
    this.maxRecent = 11;
    this.colorStore = DefaultColors;

    this.refreshTool = throttle(() => {
      this.sheet.emit(ToolsEventConstant.REFRESH);
    }, 17);
  }

  protected pushRecent(v: string) {
    this.recentColorStore = this.recentColorStore.filter((color) => color !== v);
    this.recentColorStore.unshift(v);
    this.recentColorStore.splice(11);
  }

  public changeColor(v: string) {
    this.value = v;
    this.recentColorStore[0] = v;
    this.refreshTool();
  }

  private initDarkModeChange() {
    this.sheet.on(EventConstant.DARK_MODE_CHANGE, () => {
      if (this.value === this.sheet.getColor(ColorType.white)) {
        this.value = this.sheet.getColor(ColorType.black);
      }
    });
  }
}
