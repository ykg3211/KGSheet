import { ToolsGroupType, toolBarColorType } from 'kgsheet';
import React, { useContext, useMemo } from 'react';
import { SheetContext } from '../..';
import Group from './group';

interface Props {
  toolBars: ToolsGroupType[];
}
export default function BaseLayout({ toolBars }: Props) {
  const { toolBar, flag } = useContext(SheetContext);

  const groups = useMemo(() => {
    const result: Array<JSX.Element> = [];
    toolBars.forEach((tool, index) => {
      result.push(<Group group={tool} key={tool.key} />);

      index !== toolBars.length - 1 &&
        result.push(
          <span
            className='kgsheet_toolBar_line'
            style={{ borderLeft: `1px solid ${toolBar.getColor(toolBarColorType.black)}` }}
            key={'line_' + tool.key}></span>,
        );
    });
    return result;
  }, [toolBars, flag]);

  return <div className='kgsheet_toolBar_container'>{groups}</div>;
}
