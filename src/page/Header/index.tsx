import React, { useState } from 'react'
import './Header.css'
import { Routes, Route, Link } from "react-router-dom";

function Header() {
  return (
    <div className="Header">
      <ul>
        <li><Link to="/getAllScore">查看全部成绩</Link></li>
      </ul>
    </div>
  )
}

export default Header
