import React, { useEffect, useReducer, useRef, useState } from 'react'
import createThree from './base';

function ThreeMain() {
  const container = useRef(null);
  useEffect(() => {
    if(container.current) {
      createThree(container.current)
    }
  },[container.current])
  return (
    <div ref={container} style={{width: '100%', height: '100%'}}></div>
  );
}

export default ThreeMain
