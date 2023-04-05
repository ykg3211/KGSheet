import React, { useContext, useMemo } from 'react';
import { SheetContext } from '..';
import { bottomBarColorType } from 'kgsheet';
import Tool from './components';

function BottomTools() {
  const { bottomBar, flag } = useContext(SheetContext);

  const columns = useMemo(() => {
    return bottomBar?.getTools?.() || [];
  }, [flag, bottomBar]);

  const style = useMemo<React.CSSProperties>(() => {
    if (bottomBar) {
      return {
        backgroundColor: bottomBar.getColor(bottomBarColorType.white),
      };
    }
    return {};
  }, [flag, bottomBar]);

  return (
    <div style={style} className='kgsheet_bottom_container'>
      {columns.map((tools, index) => (
        <div className='kgsheet_bottom_container_panel' key={'columns_' + index}>
          {tools.map((tool) => (
            <Tool key={tool.key || 'columns_tool_' + index} tool={tool} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default BottomTools;
