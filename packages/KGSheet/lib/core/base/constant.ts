// 渲染的顺序
// 先渲染上面的，在渲染下面的，
// 下面的回覆盖上面的
export enum RenderZIndex {
  TABLE_CELLS, // 单元格
  TABLE_LINE, // 表格线
  TABLE_SPAN_CELLS, // 跨行单元格
  SELECT_CELLS, // 选中的单元格
  COPY_SELLS_BORDER, // 复制剪切的单元格边框
  // SHADOW, // shadow
  SIDE_BAR, // 表格X轴Y轴
  SELECT_CELLS_SIDEBAR_LINE, // 选中的单元格 对应的sidebar中的横线
  SCROLL_BAR, // 滚动条
}

// 事件的识别顺序, 越上面越大
// 意思就是上面的judgeFunc方法返回true的时候下面的方法就不执行。 但是同级的方法还是会执行。
export enum EventZIndex {
  SELECT_TABLE_CELL, // 选中单元格的边框
  SCROLL_BAR, // 滚动条
  SIDE_BAR, // 左上边框
  TABLE_CELLS, // 单元格
}