import React from 'react';

interface Props {
  icon: string;
  fontSize?: number;
  color?: string;
}

export default function Icon({ icon, fontSize = 20, color = 'black' }: Props) {
  return (
    <svg className='tgsheet-icon' aria-hidden='true' style={{ fontSize: fontSize + 'px', color: color }}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
}
