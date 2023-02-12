import Main, {
  createDefaultData,
  ExcelConfig,
  RefType,
  SheetSetting,
  createDefaultCell,
  Cell,
} from 'kgsheet-for-react';
import 'kgsheet-for-react/dist/index.css';
import React, { useRef } from 'react';
import defaultData from './constant.json';
// import originData from './sheet.json';

// const formatSheetArrData = () => {
//   const w: number[] = [100, 822, 69, 61, 446, 300, 401, 200];
//   const h: number[] = [];
//   const cells: ExcelConfig['cells'] = originData.map((item) => {
//     h.push(300);
//     return [
//       createDefaultCell(''),
//       createDefaultCell(item.title),
//       createDefaultCell(item.price + ''),
//       createDefaultCell(item.currency),
//       createDefaultCell(item.detailURL),
//       // @ts-ignore
//       createDefaultCell(item.imgUrl, 'image'),
//       createDefaultCell(item.company),
//       createDefaultCell(item.unit),
//     ];
//   });
//   return {
//     w,
//     h,
//     cells,
//     spanCells: {
//       '0_0': { ...createDefaultCell('情趣内衣'), span: [1, 900] },
//     } as any,
//   };
// };

function Sheet() {
  // const [defaultData] = useState(createDefaultData(30, 100));
  const sheetRef = useRef<RefType>(null);
  const sheetConfig = useRef<SheetSetting>({
    devMode: false,
    darkMode: 'auto',
    readOnly: false,
  });

  return (
    <>
      <div style={{ height: 'calc(100% - 30px)' }}>
        {/* @ts-ignore */}
        <Main ref={sheetRef} defaultData={createDefaultData(30, 100)} config={sheetConfig.current} />
      </div>
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
        <div
          style={{ margin: '0 10px', cursor: 'pointer' }}
          onClick={() => {
            // @ts-ignore
            sheetRef.current?.setData(createDefaultData(10, 1000000));
          }}>
          大数据(100w 行)
        </div>
      </div>
    </>
  );
}

export default Sheet;
