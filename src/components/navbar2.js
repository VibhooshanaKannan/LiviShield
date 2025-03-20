import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from './AuthContext';
import Modal from './Modal';
import SignIn from './SignIn'; 
import './navbar.css';
import logo from '../assets/logo.png'; 
import { Link } from 'react-router-dom';

function Navbar2() {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authState, logout } = useAuth();

  useEffect(() => {
    const userAuthenticated = localStorage.getItem('userAuthenticated') === 'true';
    setIsAuthenticated(userAuthenticated);
  }, []);

  const handleSignInClick = () => {
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  const handleLogout = () => {
    setLoading(true); // Show the loading spinner and message

    setTimeout(() => {
      localStorage.removeItem('userAuthenticated');
      setIsAuthenticated(false);
      setLoading(false); // Hide the loading spinner and message
      navigate('/', { state: { message: 'You have been logged out successfully.' } });
    }, 3000); // Wait for 3 seconds before logging out
  };


  const handleDashboard = () => {
    if (authState) {
      navigate('/userprofile', { state: { authState, selectedPlan: authState.userInfo.selectedPlan } }); // Replace selectedPlan with actual value if needed
    }
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
                <li><Link className="dropdown-item" to="/healthrenewal">Health</Link></li>
                  <li><a className="dropdown-item" href="#">Motor Renewal</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <button id="manageprofile" className="btn btn-primary ms-2" onClick={handleDashboard}>
                 Manage Profile
                </button>
              </li>

              <li className="nav-item">
                <button id="logout" className="btn btn-primary ms-2" onClick={handleLogout}>
                 Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Logging out...</p>
        </div>
      )}
      
      <Modal show={showModal} onClose={handleCloseModal}>
        <SignIn />
      </Modal>
    </div>
  );
}

export default Navbar2;
