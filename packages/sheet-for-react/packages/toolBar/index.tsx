import React, { useContext, useMemo } from 'react';
import { SheetContext } from '../';
import BaseLayout from './components/baseLayout';
import { colorType } from 'kgsheet';

function Tools() {
  const { toolBar, flag } = useContext(SheetContext);

  const tools = useMemo(() => {
    return toolBar && toolBar.getTools() && <BaseLayout toolBars={toolBar.getTools()} />;
  }, [flag, toolBar]);

  const style = useMemo<React.CSSProperties>(() => {
    if (toolBar) {
      return {
        backgroundColor: toolBar.getColor(colorType.white),
      };
    }
    return {};
  }, [flag, toolBar]);

  return (
    <div style={style} className='kgsheet_toolBarContainer'>
      {tools}
    </div>
  );
}

export default Tools;
