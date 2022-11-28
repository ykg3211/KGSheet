import React, { useContext, useMemo } from 'react';
import Icon from '../../../icons/icon';
import { Select, Tooltip } from 'antd';
import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import { BaseTool } from 'kgsheet/dist/toolBar/tools/base';
import { SheetContext } from '../../..';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';
import Popover from '../popover';

interface Props {
  tool: BaseTool;
  color: string;
  style: React.CSSProperties;
}

const OptionsTool = ({ tool, style, color }: Props) => {
  const { toolBar, flag } = useContext(SheetContext);

  const backgroundColor = useMemo<string>(() => {
    if (toolBar) {
      return toolBar.getColor(colorType.white);
    }
    return 'rgba(0,0,0,0)';
  }, [flag]);

  return (
    <Tooltip placement='top' title={tool.toolTip}>
      <Popover trigger={<div>1231</div>}>
        <div>1231</div>
      </Popover>
      <Select
        size='small'
        bordered={false}
        defaultValue='lucy'
        style={Object.assign({ width: tool.width + 'px', color }, style)}
        dropdownStyle={{
          backgroundColor: backgroundColor,
        }}
        onChange={() => {
          //
        }}
        options={[
          {
            value: 'jack',
            label: 'Jack',
          },
          {
            value: 'lucy',
            label: 'Lucy',
          },
          {
            value: 'disabled',
            disabled: true,
            label: 'Disabled',
          },
          {
            value: 'Yiminghe',
            label: 'yiminghe',
          },
        ]}
      />
    </Tooltip>
  );
};
export default OptionsTool;
