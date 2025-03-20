import React from 'react';
import './Header.css'; // Import the CSS file for styling
import logo from '../assets/logo.png'; // Make sure the logo.png is in the 'assets' folder

const Header = () => {
  return (
    <div className="header-container">
      <div className="logo">
        <img src={logo} alt="Livi Shield Logo" />
        <span className="brand-name"></span>
      </div>

      <div className="nav-items">
        <div className="dropdown">
          <button className="dropdown-btn">Insurance Products ▼</button>
          <div className="dropdown-content">
            <a href="#">Health Insurance</a>
            <a href="#">Car Insurance </a>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropdown-btn">Renew Your Policy ▼</button>
          <div className="dropdown-content">
            <a href="#">Health Renewal</a>
            <a href="#">Motor Renewal</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
