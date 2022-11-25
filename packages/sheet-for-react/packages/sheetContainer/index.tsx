import React, { useContext, useEffect, useRef, useState } from 'react';
import Excel, { createDefaultData } from 'kgsheet';
import { SheetContext } from '..';

function Container() {
  const container = useRef(null);
  const once = useRef(true);
  const { setSheet } = useContext(SheetContext);
  useEffect(() => {
    if (once.current) {
      const instance = new Excel(container.current);
      setSheet(instance);
      const data = createDefaultData(100, 1000);
      instance.setData(data);
      once.current = false;
    }
  }, [container.current]);

  return <div ref={container} className='kgsheet_target'></div>;
}

export default Container;
