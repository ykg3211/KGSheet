import React, { useRef } from 'react';
import { Popover as _Propover, PopoverProps } from 'antd';

interface Props extends PopoverProps {
  children: JSX.Element;
  triggerElm: JSX.Element;
}
const Popover = (props: Props) => {
  const { children, triggerElm, ...rest } = props;
  const popover = useRef(null);

  return (
    <_Propover ref={popover} placement='bottomLeft' content={children} trigger='click' {...rest}>
      {triggerElm}
    </_Propover>
  );
};
export default Popover;
