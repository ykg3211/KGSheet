import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore
import Main from 'kgsheet-for-react';
import './index.css';
import 'antd/dist/antd.css';
import 'kgsheet-for-react/dist/index.css';
import { Button } from 'antd';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div>
      <Button>1</Button>
      {/* <Main /> */}
    </div>
  </React.StrictMode>,
);
