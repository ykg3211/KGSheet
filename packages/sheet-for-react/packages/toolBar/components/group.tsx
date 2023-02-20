import React from 'react';
import { ToolsGroupType } from 'kgsheet';
import Tools from './tools';

interface Props {
  group: ToolsGroupType;
}

export default function Group({ group }: Props) {
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
