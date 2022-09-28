import React, { useState } from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from '@/page/Home'
import Scrool from '@/page/Scrool'
import Formily from '../page/Formily'
import ThreeMain from '../page/Three'
import Excel from '../page/Excel'
import { Link, Outlet } from 'react-router-dom';

function Router() {
  const createRouteElement = () => {
    return <div style={{
      width: '100%',
      height: '100%',
      display: 'flex'
    }}>
      <div style={{
        width: '200px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Link to="/home">Home</Link>
        <Link to="/scroll">scroll</Link>
        <Link to="/formily">formily</Link>
        <Link to="/ThreeMain">ThreeMain</Link>
        <Link to="/Excel">Excel</Link>
      </div>
      <div style={{
        width: '100%',
        height: '100%',
      }}>
        <Outlet></Outlet>
      </div>
    </div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={createRouteElement()} >
          <Route path="/home" element={<Home />} />
          <Route path="/scroll" element={<Scrool />} />
          <Route path="/formily" element={<Formily />} />
          <Route path="/Excel" element={<Excel />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
