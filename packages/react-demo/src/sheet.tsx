import Main, { createDefaultData, RefType, SheetSetting } from 'kgsheet-for-react';
import React, { useRef, useState } from 'react';

function Sheet() {
  const [defaultData] = useState(createDefaultData(30, 100));
  const sheetRef = useRef<RefType>(null);
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
        获取Data
      </div>
    </>
  );
}

export default Sheet;
