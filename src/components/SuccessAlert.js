// SuccessAlert.js
import React from 'react';
import './SuccessAlert.css'; // Add your custom styling

const SuccessAlert = ({ message }) => {
  return (
    <div className="success-alert">
      {message}
    </div>
  );
};

export default SuccessAlert;
