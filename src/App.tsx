import React, { useEffect, useRef, useState } from 'react'
import './main.module.less'
import './App.css'
import Router from './router/router'

function App() {
  const app = useRef(null);

  return (
    <div ref={app} className="App">
      <Router></Router>
    </div>
  )
}

export default App
