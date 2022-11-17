import React, { useEffect } from 'react';
const BaseTool = ({ tool }: any) => {
  return (
    <i
      onClick={() => {
        tool.click?.();
      }}
      className='tgsheet_btn iconfont sheet_icona-alignbottom'></i>
  );
};
export default BaseTool;
