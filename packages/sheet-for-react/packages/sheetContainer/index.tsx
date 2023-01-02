import React, { useContext, useEffect, useRef, useState } from 'react';
import Excel, { createDefaultData } from 'kgsheet';
import { SheetContext, SheetProps } from '..';

function Container({ defaultData, config }: SheetProps) {
  const container = useRef(null);
  const once = useRef(true);
  const { setSheet } = useContext(SheetContext);
  useEffect(() => {
    if (once.current) {
      const instance = new Excel(container.current);
      setSheet(instance);
      const data = defaultData || createDefaultData(30, 500);
      instance.setData(data);
      once.current = false;
    }
  }, []);

  return <div ref={container} className='kgsheet_target'></div>;
}

export default Container;
