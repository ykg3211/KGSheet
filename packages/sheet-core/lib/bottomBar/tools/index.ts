import { CellBorder } from './CellBorder';

export enum ToolsEnum {
  CELL_BORDER = 'cell_border', // 撤销
}

export interface ToolsMapType {
  [ToolsEnum.CELL_BORDER]: CellBorder;
}

const ToolsMap = {
  [ToolsEnum.CELL_BORDER]: CellBorder,
};

export default function getTools(name: ToolsEnum) {
  return ToolsMap[name] || CellBorder;
}
