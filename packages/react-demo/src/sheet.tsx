import Main, { createDefaultData, SheetSetting } from 'kgsheet-for-react';
import React, { useRef, useState } from 'react';

function Sheet() {
  const [defaultData] = useState(createDefaultData(30, 100));
  const sheetConfig = useRef<SheetSetting>({
    devMode: true,
    darkMode: 'auto',
  });
  return <Main defaultData={defaultData} config={sheetConfig.current} />;
}

export default Sheet;
