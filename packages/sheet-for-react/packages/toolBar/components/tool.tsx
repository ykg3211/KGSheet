import React from 'react';
import Icon from '../../icons/icon';
import { Tooltip } from 'antd';
import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import { BaseTool } from 'kgsheet/dist/toolBar/tools/base';

interface Props {
  group: ToolsGroupType<BaseTool>;
  tool: BaseTool;
  style: React.CSSProperties;
  color: string;
  needLabel?: boolean;
}

const Tool = ({ group, tool, style, color, needLabel = false }: Props) => {
  return (
    <Tooltip placement='bottom' title={tool.toolTip}>
      <span
        style={Object.assign(
          {
            ...style,
            color,
          },
          tool.style,
        )}
        className={'kgsheet_btn ' + tool.class}
        onClick={() => {
          tool.click();
        }}>
        <Icon icon={tool.icon} color={color}></Icon>
        {needLabel && <span className='kgsheet_btn_label'>{tool.label}</span>}
      </span>
    </Tooltip>
  );
};
export default Tool;
