import Main, { createDefaultData, SheetSetting } from 'kgsheet-for-react';
import React, { useEffect, useRef, useState } from 'react';

function Sheet() {
  const [defaultData] = useState(createDefaultData(30, 100));
  const sheetRef = useRef(null);
  const sheetConfig = useRef<SheetSetting>({
    devMode: false,
    darkMode: 'auto',
  });

  return (
    <>
      <Main ref={sheetRef} defaultData={defaultData} config={sheetConfig.current} />
      <div
        onClick={() => {
          console.log(sheetRef.current?.getData?.());
        }}>
        huoqu
      </div>
    </>
  );
}

export default Sheet;
