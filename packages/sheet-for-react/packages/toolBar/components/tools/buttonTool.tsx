import React, { useContext } from 'react';
import Icon from '../../../icons/icon';
import { Tooltip } from 'antd';
import { BaseTool } from 'kgsheet/dist/toolBar/tools/base';
import { SheetContext } from '../../..';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';
import { TooltipPlacement } from 'antd/es/tooltip';

interface Props {
  tool: BaseTool;
  style: React.CSSProperties;
  toolTipPlacement?: TooltipPlacement;
  needLabel?: boolean;
}

const ButtonTool = ({ tool, style, needLabel = false, toolTipPlacement = 'top' }: Props) => {
  const { color } = useContext(SheetContext);
  return (
    <Tooltip placement={toolTipPlacement} title={tool.toolTip}>
      <span
        style={Object.assign(
          {
            ...style,
            color: color(colorType.black),
          },
          tool.style,
        )}
        className={'kgsheet_btn ' + tool.class}
        onClick={() => {
          tool.click();
        }}>
        <Icon icon={tool.icon} color={color(colorType.black)}></Icon>
        {needLabel && <span className='kgsheet_btn_label'>{tool.label}</span>}
      </span>
    </Tooltip>
  );
};
export default ButtonTool;
