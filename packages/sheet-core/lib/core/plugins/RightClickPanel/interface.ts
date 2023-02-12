export enum RightClickPanelType {
  CELL = 'cell',
  TOP_BAR = 'top_bar',
  LEFT_BAR = 'left_bar',
}

export interface BasePanelType {
  x: number;
  y: number;
  darkMode: boolean;
}

interface CellPanelType extends BasePanelType {
  type: RightClickPanelType.CELL;
}

interface TopBarPanelType extends BasePanelType {
  type: RightClickPanelType.TOP_BAR;
}

interface RightBarPanelType extends BasePanelType {
  type: RightClickPanelType.LEFT_BAR;
}

export type ShowPanelProps = CellPanelType | TopBarPanelType | RightBarPanelType;
