# `KGSheet`

## 介绍

一个开源的 Canvas 绘制的高性能 Sheet 组件。
[在线 demo](http://ykgykg.fun/)

#### 支持框架：

- [x] React
- [ ] Vue3(未来支持)

#### 支持功能：

- [x] 表格功能可配置
- [x] 文本输入
- [ ] 富本文输入
- [x] 文本样式修改
- [x] 单元格框选
- [x] 移动被框选的单元格
- [x] 按规律扩展被选单元格
- [x] 鼠标触边移动
- [x] 撤销反撤销
- [x] 暗夜主题
- [x] 跟随系统主题
- [x] 合并单元格
- [x] 常用键盘操作
- [x] 复制粘贴（发布线上需要 https 支持）
- [x] 从 excel 复制粘贴文本
- [ ] 从 excel 复制粘贴文本的样式
- [ ] 右键多功能卡片
- [ ] 全局搜索

#### 未来目标

- [ ]打造一个拥有良好的二次开发体验的基础组件框架
- [ ]提供一个友好的自定义功能实现插件
- [ ]提供一个低成本的协同编辑解决方案
- [ ]全面兼容 Excel 的格式。支持双向复制粘贴功能。

## 如何使用

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

## RUN

> 首次启动项目会报一些 Failed 错误，不必关心，这是正常的。

```
// 如果已经安装过rush则可以跳过
npm install -g @microsoft/rush@5.83.1

rush update

npm run start
```
