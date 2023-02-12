import React, { useContext, useMemo } from 'react';
import { SheetContext } from '../';
import BaseLayout from './components/baseLayout';
import { toolBarColorType } from 'kgsheet';
import ShadowInput from './components/shadowInput';

function Tools() {
  const { toolBar, flag } = useContext(SheetContext);

  const tools = useMemo(() => {
    return toolBar && toolBar.getTools() && <BaseLayout toolBars={toolBar.getTools()} />;
  }, [flag, toolBar]);

  const style = useMemo<React.CSSProperties>(() => {
    if (toolBar) {
      return {
        backgroundColor: toolBar.getColor(toolBarColorType.white),
      };
    }
    return {};
  }, [flag, toolBar]);

  return (
    <div style={style} className='kgsheet_toolBarContainer'>
      {tools}
      <ShadowInput />
    </div>
  );
}

export default Tools;
