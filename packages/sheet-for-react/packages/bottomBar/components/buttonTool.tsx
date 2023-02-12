import React, { useContext, useMemo } from 'react';
import { BaseTool, toolBarColorType } from 'kgsheet';
import Icon from '../../icons/icon';
import { Tooltip } from 'antd';
import { SheetContext } from '../..';
import { TooltipPlacement } from 'antd/es/tooltip';

interface Props {
  tool: BaseTool;
  style: React.CSSProperties;
  toolTipPlacement?: TooltipPlacement;
  needLabel?: boolean;
}

const ButtonTool = ({ tool, style, needLabel = false, toolTipPlacement = 'top' }: Props) => {
  const { color } = useContext(SheetContext);

  const className = useMemo(() => {
    return [
      tool.class,
      'kgsheet_btn kgsheet_base_btn',
      tool.active ? 'kgsheet_active_color' : '',
      tool.disabled ? 'kgsheet_btn_disabled' : '',
    ].join(' ');
  }, [tool.class, tool.active]);

  const fontColor = tool.active ? 'rgb(76, 136, 255)' : color(toolBarColorType.black);

  return (
    <Tooltip placement={toolTipPlacement} title={tool.toolTip}>
      <span
        style={Object.assign(
          {
            ...style,
            color: fontColor,
          },
          tool.style,
        )}
        className={className}
        onClick={() => {
          !tool.disabled && tool.click();
        }}>
        <Icon icon={tool.icon} color={fontColor}></Icon>
        {needLabel && <span className='kgsheet_btn_label'>{tool.label}</span>}
      </span>
    </Tooltip>
  );
};
export default ButtonTool;
