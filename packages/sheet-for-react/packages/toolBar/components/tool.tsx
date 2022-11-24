import React, { useEffect } from 'react';
import Icon from '../../icons/icon';
import { Tooltip } from 'antd';
import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import { BaseTool } from 'kgsheet/dist/toolBar/tools/base';

interface Props {
  group: ToolsGroupType<BaseTool>;
  tool: BaseTool;
}

const Tool = ({ group, tool }: Props) => {
  return (
    <Tooltip placement='bottom' title={tool.toolTip}>
      <span
        className='kgsheet_btn'
        onClick={() => {
          tool.click();
        }}>
        <Icon icon={tool.icon} fontSize={group.iconWidth}></Icon>
        <span className='kgsheet_btn_label'>{tool.label}</span>
      </span>
    </Tooltip>
  );
};
export default Tool;
