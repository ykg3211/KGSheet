import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore
import Main from 'kgsheet-for-react';
import './index.css';
import 'antd/dist/antd.css';
import 'kgsheet-for-react/src/icons/iconfont.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
