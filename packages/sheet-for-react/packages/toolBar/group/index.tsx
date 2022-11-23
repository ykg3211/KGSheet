import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import React, { useMemo, useRef } from 'react';
import Icon from '../../icons/icon';

interface Props {
  group: ToolsGroupType;
}

export default function Group({ group }: Props) {
  return (
    <div className='kgsheet_toolBar_group'>
      {group.tools.map((tool) => {
        return (
          <span
            className='kgsheet_btn'
            key={tool.key}
            onClick={() => {
              tool.click();
            }}>
            <Icon icon={tool.icon} fontSize={group.iconWidth}></Icon>
            <span className='kgsheet_btn_label'>{tool.label}</span>
          </span>
        );
      })}
    </div>
  );
}
