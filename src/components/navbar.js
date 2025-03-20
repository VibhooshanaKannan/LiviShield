// src/Navbar.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import SignIn from './SignIn'; // Import the SignIn component
import './navbar.css';
import logo from '../assets/logo.png'; 
import HealthInsurance from './HealthInsurance';
import { Link } from 'react-router-dom';

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (for example, by checking localStorage)
    const userAuthenticated = localStorage.getItem('userAuthenticated') === 'true';
    setIsAuthenticated(userAuthenticated);
  }, []);

  const handleSignInClick = () => {
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  const handleLogout = () => {
    // Perform logout operations (e.g., clear localStorage)
    localStorage.removeItem('userAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
        <img src={logo} alt="PolicyBazaar Logo" className="navbar-logo" />
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="insuranceDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Insurance Products
                </a>
                <ul className="dropdown-menu" aria-labelledby="insuranceDropdown">
                <li><Link className="dropdown-item" to="/health-insurance">Health</Link></li>
                <li><Link className="dropdown-item" to="/car-insurance">Car</Link></li>
                 
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="renewDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Renew Your Policy
                </a>
                <ul className="dropdown-menu" aria-labelledby="renewDropdown">
                <li><Link className="dropdown-item" to="/healthrenewal">Health Renewal</Link></li>
                  <li><a className="dropdown-item" href="#">Motor Renewal</a></li>
                </ul>
              </li>
              
              <li className="nav-item">
                <button id="signin" className="btn btn-primary ms-2" onClick={handleSignInClick}>
                  Sign In
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal show={showModal} onClose={handleCloseModal}>
        <SignIn />
      </Modal>
    </div>
  );
}

export default Navbar;