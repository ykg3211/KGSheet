import React from 'react';
import { Popover as _Propover, PopoverProps } from 'antd';

interface Props extends PopoverProps {
  children: JSX.Element;
  triggerElm: JSX.Element;
}
const Popover = (props: Props) => {
  const { children, triggerElm, placement = 'bottomLeft', ...rest } = props;

  return (
    <_Propover
      overlayClassName='kgsheet_option_popover'
      placement={placement}
      content={children}
      trigger='click'
      {...rest}>
      {triggerElm}
    </_Propover>
  );
};
export default Popover;
