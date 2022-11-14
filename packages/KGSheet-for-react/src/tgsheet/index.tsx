import React from 'react'
import { useState } from 'react';
import Container from './container'
import './index.css';
import Tools from './toolBar';

interface sheet {
  sheet: any,
  setSheet: (v: any) => void,
  toolBar: any,
  setToolBar: (v: any) => void,
}

export const SheetContext = React.createContext<sheet>({
  sheet: null,
  setSheet: () => { },
  toolBar: null,
  setToolBar: () => { },
});

function Main() {
  const [sheet, setSheet] = useState(null);
  const [toolBar, setToolBar] = useState(null);

  const handleSheet = (v: any) => {
    v && setSheet(v);
  }

  const handleToolBar = (v: any) => {
    v && setToolBar(v);
  }

  return (
    <SheetContext.Provider value={{
      sheet: sheet,
      setSheet: handleSheet,
      toolBar: toolBar,
      setToolBar: handleToolBar,
    }}>
      <div className='tgsheet'>
        <div className='tgsheet_toolbar'>
          <Tools />
        </div>
        <div className='tgsheet_content'>
          <Container />
        </div>
      </div>
    </SheetContext.Provider>
  )
}

export default Main
