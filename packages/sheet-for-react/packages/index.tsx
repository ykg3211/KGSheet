import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { useState } from 'react';
import Container from './sheetContainer';
import Tools from './toolBar';
import BottomTools from './bottomBar';
import './icons/iconfont.js';
import Excel, {
  ToolBar,
  BusinessEventConstant,
  ToolsEventConstant,
  toolBarColorType,
  ExcelConfig,
  SheetSetting,
  BottomBar,
} from 'kgsheet';
import 'antd/dist/antd.css';
import message from 'antd/lib/message';
import RightPanel from './rightPanel';

import './index.css';

interface Sheet {
  flag: number;
  color: (name: toolBarColorType) => string;
  sheet: Excel;
  setSheet: (v: Excel) => void;
  toolBar: ToolBar;
  bottomBar: BottomBar;
  setToolBar: (v: ToolBar) => void;
}

export const SheetContext = React.createContext<Sheet>({
  flag: 0,
  sheet: null,
  color: (name: toolBarColorType) => name,
  setSheet: () => {},
  toolBar: null,
  bottomBar: null,
  setToolBar: () => {},
});

export interface SheetProps {
  defaultData?: ExcelConfig;
  config?: SheetSetting;
}

export interface RefType {
  getData: () => ExcelConfig;
  setData: (v: ExcelConfig) => void;
}

const Main = React.forwardRef<RefType, SheetProps>(({ defaultData, config }, ref) => {
  const [sheet, setSheet] = useState<Excel | null>(null);
  const [toolBar, setToolBar] = useState<ToolBar | null>(null);
  const [bottomBar, setBottomBar] = useState<BottomBar | null>(null);
  const [flag, setFlag] = useState(0);

  useImperativeHandle(ref, () => ({
    getData: () => {
      return sheet?.getData?.();
    },
    setData: (v: ExcelConfig) => {
      sheet.data = v;
    },
  }));

  const refresh = useCallback(() => {
    setFlag((v) => v + 1);
  }, [setFlag]);

  const getColor = useCallback(
    (v: toolBarColorType) => {
      if (!toolBar) {
        return v;
      }

      return toolBar.getColor(v);
    },
    [toolBar],
  );

  useEffect(() => {
    if (sheet) {
      sheet.on(ToolsEventConstant.REFRESH, refresh);
      sheet.on(BusinessEventConstant.MSG_BOX, ({ type, message: msg }) => {
        if (config.message) {
          config.message({
            type,
            message: msg,
          });
        } else {
          message?.[type]?.({
            content: msg,
          });
        }
      });
    }
  }, [sheet]);

  useEffect(() => {
    if (sheet && !toolBar) {
      const instance = new ToolBar({
        sheet,
        config,
      });
      setToolBar(instance);

      instance.on?.(ToolsEventConstant.REFRESH, refresh);
    }

    if (sheet && !bottomBar) {
      const instance = new BottomBar({
        sheet,
        // config: {},
      });
      setBottomBar(instance);

      instance.on?.(ToolsEventConstant.REFRESH, refresh);
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
        bottomBar: bottomBar,
        setToolBar: handleToolBar,
      }}>
      <div className='kgsheet'>
        <div className='kgsheet_toolbar'>
          <Tools />
        </div>
        <div className='kgsheet_content'>
          <Container config={config} defaultData={defaultData} />
        </div>
        <div className='kgsheet_bottom'>
          <BottomTools />
        </div>
        <RightPanel />
      </div>
    </SheetContext.Provider>
  );
});

export default Main;
export * from 'kgsheet';
