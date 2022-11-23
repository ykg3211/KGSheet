import { ToolsGroupType } from 'kgsheet/dist/toolBar/interface';
import React, { useMemo } from 'react';
import Group from '../group';

interface Props {
  toolBars: ToolsGroupType[];
}
export default function BaseLayout({ toolBars }: Props) {
  const groups = useMemo(() => {
    const result: Array<JSX.Element> = [];
    toolBars.forEach((tool, index) => {
      result.push(<Group group={tool} key={tool.key} />);
      index !== toolBars.length - 1 &&
        result.push(<span className='kgsheet_toolBar_line' key={'line_' + tool.key}></span>);
    });
    return result;
  }, toolBars);
  return <div className='kgsheet_toolBar_container'>{groups}</div>;
}
