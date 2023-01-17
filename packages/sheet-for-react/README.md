# `KGSheet-for-react`

## 介绍

一个开源的 Canvas 绘制的高性能 Sheet 组件（React）。
[在线 demo](http://ykgykg.fun/)

### React

```typescript
import Main, { createDefaultData, RefType, SheetSetting } from 'kgsheet-for-react';
import React, { useRef, useState } from 'react';

function Sheet() {
  const [defaultData] = useState(createDefaultData(30, 100));
  const sheetRef = useRef<RefType>(null);
  const sheetConfig = useRef<SheetSetting>({
    darkMode: 'auto',
  });

  return (
    <>
      <Main ref={sheetRef} defaultData={defaultData} config={sheetConfig.current} />
      <div
        onClick={() => {
          console.log(sheetRef.current?.getData?.());
        }}>
        点击获取Sheet的Data
      </div>
    </>
  );
}

export default Sheet;
```

### Type

##### SheetSettingSheetSetting

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | --- |
| devMode | 开发模式，开启之后会输出日志，方便调试 | `boolean` | `false` | false
| darkMode | 黑夜模式，支持黑、白和跟随系统 | `boolean ｜ 'auto'` | `'auto'` | false
| readOnly | 是否开启只读  | `boolean` | `false` | false 
| message | 表格输出的一些提示方法，用户可以自定义设置 | (v: { type: 'info' \| 'success' \| 'error' \| 'warning'; message: string }) => void | `false` | false 
| barSetting | sheet顶部功能区配置 | `Array<ToolsGroupConfig<ToolsEnum>>` |  | false

##### ToolsGroupConfig

> 补充上方 barSetting 的类型
> 是一个二维数组，最多支持两行按钮

<!-- prettier-ignore -->
```typescript
interface ToolsGroupConfig<T> {
  tools: T[][];
}

enum ToolsEnum {
  REVERT = 'revert', // 撤销
  ANTI_REVERT = 'anti_revert', // 反撤销
  FONT_SIZE = 'font_size', // 文本字体大小
  DARK_MODE = 'dark_mode', // 黑夜模式切换
  CLEAR_STYLE = 'clear_style', // 清除样式
  FONT_WEIGHT = 'font_weight', // 字体粗细
  FONT_DELETE_LINE = 'font_delete_line', // 删除线
  FONT_ITALIC = 'font_italic', // 斜体
  FONT_UNDER_LINE = 'font_under_line', // 下划线
  COMBINE_CELLS = 'combine_cells', // 合并单元格
  TEXT_ALIGN_LEFT = 'text_align_left', // 文字左对齐
  TEXT_ALIGN_CENTER = 'text_align_center', // 文字居中
  TEXT_ALIGN_RIGHT = 'text_align_right', // 文字右对齐
  FONT_COLOR = 'font_color', // 子体颜色
  BACKGROUND_COLOR = 'background_color', // 背景颜色
}
```

参考默认值：

```typescript
const defaultToolBarConfig: BarSettingType = [
  {
    tools: [[ToolsEnum.REVERT, ToolsEnum.ANTI_REVERT, ToolsEnum.CLEAR_STYLE]],
  },
  {
    tools: [
      [ToolsEnum.FONT_SIZE, ToolsEnum.FONT_COLOR, ToolsEnum.BACKGROUND_COLOR],
      [ToolsEnum.FONT_WEIGHT, ToolsEnum.FONT_DELETE_LINE, ToolsEnum.FONT_ITALIC, ToolsEnum.FONT_UNDER_LINE],
    ],
  },
  {
    tools: [
      [ToolsEnum.COMBINE_CELLS, ToolsEnum.DARK_MODE],
      [ToolsEnum.TEXT_ALIGN_LEFT, ToolsEnum.TEXT_ALIGN_CENTER, ToolsEnum.TEXT_ALIGN_RIGHT],
    ],
  },
];
```
