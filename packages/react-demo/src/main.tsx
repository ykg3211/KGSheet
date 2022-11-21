import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore
import './index.css';
import 'antd/dist/antd.css';

// import Main from 'kgsheet-for-react';
// import 'kgsheet-for-react/dist/index.css';

import Main from 'kgsheet-for-react/packages/index';
import 'kgsheet-for-react/packages/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
