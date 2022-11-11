import React, { useEffect, useRef, useState } from 'react'
import './main.module.less'
import './App.css'
import Excel, {createDefaultData} from '../lib/index';

function App() {
  const container = useRef(null);
  const once = useRef(true);
  const instance = useRef(null);
  useEffect(() => {
    if (once.current) {
      instance.current = new Excel(container.current);
      const data = createDefaultData(20, 1000);
      instance.current.setData(data);
      once.current = false;
    }
  }, [container.current])

  return (
    <>
      <div ref={container} style={{ width: '90%', height: '90%', marginTop: '20px' }}></div>
      <div onClick={() => {
        instance.current.reverseDarkMode();
      }}>切主题</div>
    </>
  );
}

export default App
