import { CellBorder } from './CellBorder';
import { SelectRange } from './SelectRange';
import { ZoomBar } from './ZoomBar';

export enum ToolsEnum {
  CELL_BORDER = 'cell_border', // 单元格默认的边框
  SELECT_RANGE = 'select_range', // 框选的范围
  ZOOM = 'zoom', // 缩放
}

export interface ToolsMapType {
  [ToolsEnum.CELL_BORDER]: CellBorder;
  [ToolsEnum.SELECT_RANGE]: SelectRange;
  [ToolsEnum.ZOOM]: ZoomBar;
}

const ToolsMap = {
  [ToolsEnum.CELL_BORDER]: CellBorder,
  [ToolsEnum.SELECT_RANGE]: SelectRange,
  [ToolsEnum.ZOOM]: ZoomBar,
};

export default function getTools(name: ToolsEnum) {
  return ToolsMap[name] || CellBorder;
}
