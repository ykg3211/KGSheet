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

  const fontColor = useMemo<string>(() => {
    if (toolBar) {
      return toolBar.getColor(colorType.black);
    }
    return 'rgba(0,0,0,0)';
  }, [flag, toolBar]);

  if (group.tools.length === 1) {
    return (
      <div className='kgsheet_toolBar_group_no_warp'>
        {group.tools[0].map((tool) => {
          return <Tools style={{ height: '48px' }} tool={tool} key={tool.key} needLabel />;
        })}
      </div>
    );
  }

  return (
    <div className='kgsheet_toolBar_group'>
      {group.tools.map((_group, index) => {
        return (
          <div className='kgsheet_toolBar_group_inline' key={_group.map((g) => g.key).join('_') + index}>
            {_group.map((tool, i) => {
              return (
                <Tools
                  toolTipPlacement={index === 0 ? 'top' : 'bottom'}
                  style={{ height: '24px' }}
                  tool={tool}
                  key={tool.key + '_' + i}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
