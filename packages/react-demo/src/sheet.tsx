import Main, { createDefaultData, RefType, SheetSetting } from 'kgsheet-for-react';
import 'kgsheet-for-react/dist/index.css';
import React, { useRef } from 'react';
import defaultData from './constant.json';

function Sheet() {
  // const [defaultData] = useState(createDefaultData(30, 100));
  const sheetRef = useRef<RefType>(null);
  const sheetConfig = useRef<SheetSetting>({
    devMode: true,
    darkMode: 'auto',
    readOnly: false,
  });

  return (
    <>
      {/* @ts-ignore */}
      <Main ref={sheetRef} defaultData={defaultData} config={sheetConfig.current} />
      <div style={{ display: 'flex' }}>
        <div
          style={{ margin: '0 10px', cursor: 'pointer' }}
          onClick={() => {
            console.log(sheetRef.current?.getData?.());
          }}>
          获取Data
        </div>
        <div
          style={{ margin: '0 10px', cursor: 'pointer' }}
          onClick={() => {
            sheetRef.current?.setData(createDefaultData(30, 100));
          }}>
          清空
        </div>
        <div
          style={{ margin: '0 10px', cursor: 'pointer' }}
          onClick={() => {
            // @ts-ignore
            sheetRef.current?.setData(defaultData);
          }}>
          生成假数据
        </div>
      </div>
    </>
  );
}

export default Sheet;
