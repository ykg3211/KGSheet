import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import Container from './sheetContainer';
import Tools from './toolBar';
import './icons/iconfont.js';
import Excel, { ToolBar } from 'kgsheet';
import { BusinessEventConstant } from 'kgsheet/dist/core/plugins/base/event';
import 'antd/dist/antd.css';
import message from 'antd/lib/message';
import { colorType } from 'kgsheet/dist/toolBar/plugins/DarkMode.ts';

interface Sheet {
  flag: number;
  color: (name: colorType) => string;
  sheet: Excel;
  setSheet: (v: Excel) => void;
  toolBar: ToolBar;
  setToolBar: (v: ToolBar) => void;
}

export const SheetContext = React.createContext<Sheet>({
  flag: 0,
  sheet: null,
  color: (name: colorType) => name,
  setSheet: () => {},
  toolBar: null,
  setToolBar: () => {},
});

function Main() {
  const [sheet, setSheet] = useState<Excel | null>(null);
  const [toolBar, setToolBar] = useState<ToolBar | null>(null);
  const [flag, setFlag] = useState(0);
  const refresh = () => {
    setFlag((v) => v + 1);
  };

  const getColor = useCallback(
    (v: colorType) => {
      if (!toolBar) {
        return v;
      }

      return toolBar.getColor(v);
    },
    [toolBar],
  );

  useEffect(() => {
    if (sheet) {
      sheet.on('refresh', refresh);
      sheet.on(BusinessEventConstant.MSG_BOX, ({ type, message: msg }) => {
        // @ts-ignore
        message?.[type]?.({
          content: msg,
        });
      });
    }
  }, [sheet]);

  useEffect(() => {
    if (sheet && !toolBar) {
      const instance = new ToolBar({
        sheet,
        // config: {},
      });
      setToolBar(instance);

      instance.on?.('refresh', refresh);
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
        flag,
        color: getColor,
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
