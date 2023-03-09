import React, { useContext, useMemo } from 'react';
import { SelectRange as SelectRangeType, toolBarColorType } from 'kgsheet';
import Icon from '../../icons/icon';
import { Tooltip } from 'antd';
import { SheetContext } from '../..';
import { TooltipPlacement } from 'antd/es/tooltip';

interface Props {
  tool: SelectRangeType;
  style: React.CSSProperties;
  toolTipPlacement?: TooltipPlacement;
  needLabel?: boolean;
}

const SelectRange = ({ tool }: Props) => {
  const { color } = useContext(SheetContext);

  const fontColor = tool.active ? 'rgb(76, 136, 255)' : color(toolBarColorType.black);

  return <div style={{ color: fontColor }}>{`行：${tool.rows}，列：${tool.columns}`}</div>;
};
export default SelectRange;
