import React from 'react';
import Group from '../group';

interface Props {
  toolBar: any;
}
export default function BaseLayout({ toolBar }: Props) {
  return (
    <div className='kgsheet_toolBar_container'>
      <Group />
      <span className='kgsheet_toolBar_line'></span>
      <Group />
    </div>
  );
}
