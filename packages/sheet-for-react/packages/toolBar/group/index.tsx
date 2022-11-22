import React from 'react';

interface Props {
  toolBar?: any;
}
export default function Group({ toolBar }: Props) {
  return (
    <div className='kgsheet_toolBar_group'>
      <span>123</span>
      <span>123</span>
      <span>123</span>
    </div>
  );
}
