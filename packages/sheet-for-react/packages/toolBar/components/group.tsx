import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';
import React, { useContext, useMemo } from 'react';
import { SheetContext } from '../..';
import Tools from './tools';

interface Props {
  group: ToolsGroupType;
}

export default function Group({ group }: Props) {
  const { toolBar, flag } = useContext(SheetContext);

  const color = useMemo<string>(() => {
    if (toolBar) {
      return toolBar.getColor(colorType.black);
    }
    return 'rgba(0,0,0,0)';
  }, [flag, toolBar]);

  if (group.lines === 1) {
    return (
      <div className='kgsheet_toolBar_group_no_warp'>
        {group.tools.map((tool) => {
          return <Tools style={{ height: '48px' }} color={color} tool={tool} key={tool.key} needLabel />;
        })}
      </div>
    );
  }

  const toolsLine = useMemo(() => {
    const result = [[...group.tools], [...group.tools]];
    return result;
  }, [group]);

  return (
    <div className='kgsheet_toolBar_group'>
      {toolsLine.map((_group, index) => {
        return (
          <div className='kgsheet_toolBar_group_inline' key={_group.map((g) => g.key).join('_') + index}>
            {_group.map((tool, i) => {
              return <Tools style={{ height: '24px' }} color={color} tool={tool} key={tool.key + '_' + i} />;
            })}
          </div>
        );
      })}
    </div>
  );
}
