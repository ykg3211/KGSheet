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

const SelectRange = ({ tool, style, needLabel = false, toolTipPlacement = 'top' }: Props) => {
  const { color } = useContext(SheetContext);
  console.log(tool);
  const fontColor = tool.active ? 'rgb(76, 136, 255)' : color(toolBarColorType.black);

  return <div>{`行：${tool.rows}，列：${tool.columns}`}</div>;
};
export default SelectRange;
