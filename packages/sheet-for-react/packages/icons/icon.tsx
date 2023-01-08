import React from 'react';

interface Props extends Partial<React.SVGProps<SVGSVGElement>> {
  icon: string;
  fontSize?: number;
  color?: string;
  className?: string;
}

export default function Icon({ icon, fontSize = 24, color = 'black', className, ...res }: Props) {
  return (
    <svg
      {...res}
      className={['kgsheet-icon', className].join(' ')}
      aria-hidden='true'
      style={{ fontSize: fontSize + 'px', color: color }}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
}
