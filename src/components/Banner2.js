// src/components/Banner.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css'; // Add this file for custom styles

function Banner2() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/viewplans'); // Redirect to the '/viewplans' route
  };

  return (
    <div className="banner-container">
      <h1>Let's find you the Best Insurance</h1>
      <p>50+ insurers with one of the best prices | Quick, easy & hassle free</p>
      <div className="banner-actions">
        <button id="view" className="btn btn-primary" onClick={handleClick}>
          View Plans
        </button>
      </div>
    </div>
  );
}


export default Banner2;
