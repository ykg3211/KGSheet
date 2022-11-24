import React, { useEffect } from 'react';
import { useState } from 'react';
import Container from './sheetContainer';
import Tools from './toolBar';
import './icons/iconfont.js';
import Excel, { ToolBar } from 'kgsheet';
import 'antd/dist/reset.css';

interface sheet {
  sheet: any;
  setSheet: (v: any) => void;
  toolBar: any;
  setToolBar: (v: any) => void;
}

export const SheetContext = React.createContext<sheet>({
  sheet: null,
  setSheet: () => {},
  toolBar: null,
  setToolBar: () => {},
});

function Main() {
  const [sheet, setSheet] = useState<Excel | null>(null);
  const [toolBar, setToolBar] = useState<ToolBar | null>(null);
  const [, setFlag] = useState(0);
  const refresh = () => {
    setFlag((v) => v + 1);
  };

  useEffect(() => {
    if (sheet) {
      sheet.on('refresh', refresh);
    }
  }, [sheet]);

  const handleSheet = (v: Excel) => {
    v && setSheet(v);
  };

  const handleToolBar = (v: ToolBar) => {
    v && setToolBar(v);
  };

  return (
    <SheetContext.Provider
      value={{
        sheet: sheet,
        setSheet: handleSheet,
        toolBar: toolBar,
        setToolBar: handleToolBar,
      }}>
      <div className='kgsheet'>
        <div className='kgsheet_toolbar'>
          <Tools />
        </div>
        <div className='kgsheet_content'>
          <Container />
        </div>
      </div>
    </SheetContext.Provider>
  );
}

export default Main;
