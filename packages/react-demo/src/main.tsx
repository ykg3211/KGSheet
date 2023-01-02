import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import 'kgsheet-for-react/dist/index.css';
import Sheet from './sheet';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sheet />
  </React.StrictMode>,
);
