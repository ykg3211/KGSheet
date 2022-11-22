import React, { useContext, useEffect, useMemo } from 'react';
import { ToolBar } from 'kgsheet';
import { SheetContext } from '../';
import { useState } from 'react';
import BaseTool from './tools/baseTool';
import BaseLayout from './baseLayout';

function Tools() {
  const { sheet, setToolBar, toolBar } = useContext(SheetContext);

  const [flag, setFlag] = useState(0);
  const refresh = () => {
    setFlag((v) => v + 1);
  };
  useEffect(() => {
    if (sheet && !toolBar) {
      const instance = new ToolBar({
        sheet,
        // config: {},
      });
      setToolBar(instance);

      instance.on?.('refresh', refresh);
    }
    return () => {
      toolBar?.off?.('refresh', refresh);
    };
  }, [sheet]);

  const tools = useMemo(() => {
    return toolBar && toolBar.getTools() && <BaseLayout toolBar={toolBar.getTools()} />;
  }, [flag, toolBar]);

  return <div className='tgsheet_toolBarContainer'>{tools}</div>;
}

export default Tools;