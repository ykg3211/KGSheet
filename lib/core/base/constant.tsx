// 渲染的顺序
export enum RenderZIndex {
  TABLE_CELLS, // 单元格
  TABLE_LINE, // 表格线
  TABLE_SPAN_CELLS, // 跨行单元格
  SIDE_BAR, // 表格X轴Y轴
  SCROLL_BAR, // 滚动条
}

// 事件的识别顺序
export enum EventZIndex {
  TABLE_CELLS, // 单元格
  SIDE_BAR, // 左上边框
  SCROLL_BAR, // 滚动条
}