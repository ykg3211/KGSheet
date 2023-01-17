import React, { useContext, useMemo } from 'react';
import { SheetContext } from '..';
import { colorType } from 'kgsheet';
import Tool from './components/tools';

function BottomTools() {
  const { bottomBar, flag } = useContext(SheetContext);

  const columns = useMemo(() => {
    return bottomBar?.getTools?.() || [];
  }, [flag, bottomBar]);

  const style = useMemo<React.CSSProperties>(() => {
    if (bottomBar) {
      console.log(bottomBar.getColor(colorType.white));
      return {
        backgroundColor: bottomBar.getColor(colorType.white),
      };
    }
    return {};
  }, [flag, bottomBar]);

  return (
    <div style={style} className='kgsheet_bottom_Container'>
      {columns.map((tools, index) => (
        <div key={'columns_' + index}>
          {tools.map((tool) => (
            <Tool key={tool.key} tool={tool} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default BottomTools;
