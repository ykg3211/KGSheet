import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './tgsheet'
import './index.css'
import 'antd/dist/antd.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
