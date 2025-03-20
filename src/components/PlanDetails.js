// PlanDetail.js

import React from 'react';
import './PlanDetail.css'; // Import the CSS file for styling

const PlanDetail = ({ plan }) => {
  if (!plan) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="plan-detail">
      <h2 className="plan-name">{plan.name}</h2>
      <div className="plan-meta">
        <p className="plan-type">Type: <strong>{plan.type}</strong></p>
        <p className="plan-amount">Amount: <strong>Rs. {plan.amount}</strong></p>
      </div>
      <div className="plan-features-benefits">
        <div className="features-container">
          <h4 className="features-heading">Features:</h4>
          <ul className="features-list">
            {plan.features.map((feature, index) => (
              <li key={index} className="feature-item">{feature}</li>
            ))}
          </ul>
        </div>
        <div className="benefits-container">
          <h4 className="benefits-heading">Claim Benefits:</h4>
          <ul className="benefits-list">
            {plan.claimBenefits.map((benefit, index) => (
              <li key={index} className="benefit-item">{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;