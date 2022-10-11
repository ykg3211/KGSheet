// 渲染的顺序
export enum RenderZIndex {
  TABLE_CELLS, // 单元格
  TABLE_LINE, // 表格线
  TABLE_SPAN_CELLS, // 跨行单元格
  SELECT_CELLS, // 选中的单元格
  // SHADOW, // shadow
  SIDE_BAR, // 表格X轴Y轴
  SELECT_CELLS_SIDEBAR_LINE, // 选中的单元格 对应的sidebar中的横线
  SCROLL_BAR, // 滚动条
}

// 事件的识别顺序, 越上面越大
export enum EventZIndex {
  SCROLL_BAR, // 滚动条
  SIDE_BAR, // 左上边框
  TABLE_CELLS, // 单元格
}