import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Main from 'kgsheet-for-react';
import 'kgsheet-for-react/dist/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
