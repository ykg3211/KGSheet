export enum RightClickPanelType {
  CELL = 'cell',
  TOP_BAR = 'top_bar',
  LEFT_BAR = 'left_bar',
}

interface CellPanelType {
  type: RightClickPanelType.CELL;
}

interface TopBarPanelType {
  type: RightClickPanelType.TOP_BAR;
}

interface RightBarPanelType {
  type: RightClickPanelType.LEFT_BAR;
}

export type ShowPanelProps = CellPanelType | TopBarPanelType | RightBarPanelType;
