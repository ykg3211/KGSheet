import { CellBorder } from './CellBorder';
import { ZoomBar } from './ZoomBar';

export enum ToolsEnum {
  CELL_BORDER = 'cell_border', // 撤销
  ZOOM = 'zoom', // 撤销
}

export interface ToolsMapType {
  [ToolsEnum.CELL_BORDER]: CellBorder;
  [ToolsEnum.ZOOM]: ZoomBar;
}

const ToolsMap = {
  [ToolsEnum.CELL_BORDER]: CellBorder,
  [ToolsEnum.ZOOM]: ZoomBar,
};

export default function getTools(name: ToolsEnum) {
  return ToolsMap[name] || CellBorder;
}
