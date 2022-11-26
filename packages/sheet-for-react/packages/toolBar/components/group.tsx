import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';
import React, { useContext, useMemo } from 'react';
import { SheetContext } from '../..';
import Tool from './tool';

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

  const splitGroup = useMemo(() => {
    const mirror = [...group.tools];
    const result = [];
    while (mirror.length > 0) {
      result.push(mirror.splice(0, 2));
    }
    return result;
  }, [group]);

  if (group.lines === 1) {
    return (
      <div className='kgsheet_toolBar_group_no_warp'>
        {group.tools.map((tool) => {
          return <Tool style={{ height: '48px' }} color={color} tool={tool} group={group} key={tool.key} needLabel />;
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      {splitGroup.map((_group, index) => {
        return (
          <div className='kgsheet_toolBar_group' key={_group.map((g) => g.key).join('_') + index}>
            {_group.map((tool, i) => {
              return (
                <Tool style={{ height: '24px' }} color={color} tool={tool} group={group} key={tool.key + '_' + i} />
              );
            })}
            {_group.length < 2 && (
              <div style={{ height: group.lines === 1 ? '48px' : '24px' }} className='kgsheet_empty_tool'></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
