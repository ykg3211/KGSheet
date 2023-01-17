import Popover from '../components/popover';
import { colorType, RightClickPanelConstant, ShowPanelProps } from 'kgsheet';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SheetContext } from '..';

function RightPanel() {
  const isInit = useRef(false);
  const { color: getColor, sheet } = useContext(SheetContext);

  const [visible, setVisible] = useState(false);
  const [panelConfig, setPanelConfig] = useState<ShowPanelProps | null>(null);

  useEffect(() => {
    if (isInit.current || !sheet) {
      return;
    }
    isInit.current = true;
    sheet.on(RightClickPanelConstant.SHOW_PANEL, (v) => {
      setVisible(true);
      setPanelConfig(v);
    });
  }, [sheet]);

  return (
    <Popover
      open={visible}
      color={getColor(colorType.white)}
      triggerElm={
        <>
          <div className='kgsheet_panel_point' style={{ top: panelConfig?.y || 0, left: panelConfig?.x || 0 }}></div>
        </>
      }>
      <div style={{ color: getColor(colorType.black) }}>
        <div>123</div>
      </div>
    </Popover>
  );
}

export default RightPanel;
