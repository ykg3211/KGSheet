import React, { useContext, useEffect, useRef } from 'react';
import Excel, { BaseSheetSetting, createDefaultData } from 'kgsheet';
import { SheetContext, SheetProps } from '..';

function Container({ defaultData, config }: SheetProps) {
  const container = useRef(null);
  const once = useRef(true);
  const { setSheet } = useContext(SheetContext);
  useEffect(() => {
    if (once.current) {
      const instance = new Excel({
        dom: container.current,
        ...config,
      } as BaseSheetSetting);
      setSheet(instance);
      const data = defaultData || createDefaultData(30, 500);
      instance.setData(data);
      // @ts-ignore
      window.ykg = instance;
      once.current = false;
    }
  }, []);

  return <div ref={container} className='kgsheet_target'></div>;
}

export default Container;
