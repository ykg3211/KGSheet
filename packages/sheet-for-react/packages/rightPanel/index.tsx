import { colorType, RightClickPanelConstant, ShowPanelProps } from 'kgsheet';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SheetContext } from '..';

function RightPanel() {
  const isInit = useRef(false);
  const panelDom = useRef(null);
  const { color: getColor, sheet, flag } = useContext(SheetContext);

  const [visible, setVisible] = useState(false);
  const [panelConfig, setPanelConfig] = useState<ShowPanelProps | null>(null);

  useEffect(() => {
    if (isInit.current || !sheet) {
      return;
    }
    isInit.current = true;
    sheet.on(RightClickPanelConstant.SHOW_PANEL, (v) => {
      setPanelConfig(v);
      setVisible(true);
    });
    sheet.on(RightClickPanelConstant.HIDE_PANEL, (v) => {
      setVisible(false);
    });
    return () => {
      sheet.un(RightClickPanelConstant.SHOW_PANEL);
      sheet.un(RightClickPanelConstant.HIDE_PANEL);
    };
  }, [sheet]);

  const style = useMemo<React.CSSProperties>(() => {
    return {
      backgroundColor: getColor(colorType.white),
      display: visible ? 'block' : 'none',
    };
  }, [flag, getColor, visible]);

  return (
    <div
      ref={panelDom}
      className='kgsheet_panel'
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      style={{ top: panelConfig?.y || 0, left: panelConfig?.x || 0, ...style }}>
      {[1, 2].map((item) => (
        <div key={item} className='kgsheet_panel_item'>
          2
        </div>
      ))}
    </div>
  );
}

export default RightPanel;
