import React, { useContext, useEffect, useMemo } from 'react';
import Icon from '../../icons/icon';
import { Tooltip } from 'antd';
import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import { BaseTool } from 'kgsheet/dist/toolBar/tools/base';
import { SheetContext } from '../..';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';

interface Props {
  group: ToolsGroupType<BaseTool>;
  tool: BaseTool;
}

const Tool = ({ group, tool }: Props) => {
  const { toolBar, flag } = useContext(SheetContext);

  const color = useMemo<string>(() => {
    if (toolBar) {
      return toolBar.getColor(colorType.black);
    }
    return 'rgba(0,0,0,0)';
  }, [flag, toolBar]);

  return (
    <Tooltip placement='bottom' title={tool.toolTip}>
      <span
        style={{ color: color }}
        className='kgsheet_btn'
        onClick={() => {
          tool.click();
        }}>
        <Icon icon={tool.icon} color={color} fontSize={group.iconWidth}></Icon>
        <span className='kgsheet_btn_label'>{tool.label}</span>
      </span>
    </Tooltip>
  );
};
export default Tool;
