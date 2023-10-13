import { CellTypeEnum, RenderCellPropsNoLocation } from '../../interfaces';
import Base from '../base/base';

export interface ComponentMetaType {
  render: (_: Base, ctx: CanvasRenderingContext2D, data: RenderCellPropsNoLocation) => void;
}
export type ComponentsMeta = Record<CellTypeEnum, ComponentMetaType>;
