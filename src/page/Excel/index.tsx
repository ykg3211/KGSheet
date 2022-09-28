import React, { useEffect, useReducer, useRef, useState } from 'react'
import createExcel from './base';

function ThreeMain() {
  const container = useRef(null);
  const once = useRef(true);
  useEffect(() => {
    if (once.current) {
      createExcel(container.current)
      once.current = false;
    }
  }, [container.current])
  return (
    <div ref={container} style={{ width: '90%', height: '90%' }}></div>
  );
}

export default ThreeMain
