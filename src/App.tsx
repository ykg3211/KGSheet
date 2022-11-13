import React, { useEffect, useRef, useState } from 'react'
import Excel, { createDefaultData } from 'kgsheet';

function App() {
  const app = useRef(null);
  const container = useRef(null);
  const once = useRef(true);
  useEffect(() => {
    if (once.current) {
      app.current = new Excel(container.current);
      const data = createDefaultData(60, 100);
      app.current.setData(data);
      window.excel = app.current;
      once.current = false;
    }
  }, [container.current])

  return (
    <>
      <div ref={container} style={{ width: '90%', height: '90%', margin: '30px 0 0 30px', border: '1px solid' }}></div>
      <div id='tools' style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
        <div onClick={() => {
          app.current.reverseDarkMode()
        }}>dark mode</div>
      </div>
    </>
  );

}

export default App
