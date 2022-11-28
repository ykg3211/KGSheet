import React from 'react';
import { Popover as _Propover } from 'antd';

interface Props {
  children: JSX.Element;
  trigger: JSX.Element;
}
const Popover = (props: Props) => {
  const { children, trigger, ...rest } = props;

  return (
    <_Propover placement='bottomLeft' content={children} trigger='click' {...rest}>
      {trigger}
    </_Propover>
  );
};
export default Popover;
