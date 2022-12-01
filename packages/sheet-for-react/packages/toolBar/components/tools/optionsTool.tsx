import React, { useContext, useRef } from 'react';
import { Tooltip } from 'antd';
import { BaseTool } from 'kgsheet/dist/toolBar/tools/base';
import { SheetContext } from '../../..';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';
import Popover from '../popover';
import { TooltipPlacement } from 'antd/es/tooltip';

interface Props {
  tool: BaseTool;
  toolTipPlacement?: TooltipPlacement;
  style: React.CSSProperties;
}

const OptionsTool = ({ tool, toolTipPlacement = 'top' }: Props) => {
  const { color: getColor } = useContext(SheetContext);
  const ref = useRef(null);
  console.log(tool);
  return (
    <Tooltip placement={toolTipPlacement} title={tool.toolTip}>
      <Popover
        color={getColor(colorType.white)}
        triggerElm={<div style={{ color: getColor(colorType.black) }}>1231</div>}>
        <div style={{ color: getColor(colorType.black) }}>1231</div>
      </Popover>
    </Tooltip>
  );
};
export default OptionsTool;
