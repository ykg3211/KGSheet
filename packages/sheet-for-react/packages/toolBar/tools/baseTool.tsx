import React, { useEffect } from 'react';
import Icon from '../../icons/icon';
const BaseTool = ({ tool }: any) => {
  return (
    <span
      onClick={() => {
        tool.click?.();
      }}
      className='tgsheet_btn'>
      <Icon icon='sheet-icona-alignright' fontSize={20} color='red' />
    </span>
  );
};
export default BaseTool;
