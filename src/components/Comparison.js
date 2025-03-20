import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Comparison.css';
import Header from './Header';

const Comparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { comparePlans } = location.state || { comparePlans: [] };

  // State to manage message display
  const [message, setMessage] = useState('');

  // Navigate back to Plans to add more plans
  const handleSelectMore = () => {
    navigate('/plans', { state: { comparePlans } });
  };

  // Navigate back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Function to handle Compare Now button click
  const handleCompareNow = () => {
    if (comparePlans.length === 2) {
      setMessage('You have selected two plans. Click below to compare!'); // Set message for two plans
    } else {
      setMessage('Please select exactly two plans to compare.'); // Set message for incorrect selection
    }
  };

  return (
    <div className="comparison-container">
      <Header />
      <h1>Compare Selected Plans</h1>
      <button className="back-button" onClick={handleBack}>
        Back
      </button>

      {/* Display message if exists */}
      {message && <p className="compare-message">{message}</p>}

      <div className="comparison-list">
        {comparePlans.length > 0 ? (
          comparePlans.map((plan, index) => (
            <div className="plan-card1" key={index}>
              <h3>{plan.name}</h3>
              <div>Type: {plan.type}</div>
              <div>Cost: Rs.{plan.amount}</div>

              {/* Plan Description */}
              <p className="plan-description">{plan.description}</p>

              <h4>Features:</h4>
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <h4>Claim Benefits:</h4>
              <ul>
                {plan.claimBenefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No plans selected for comparison</p>
        )}
      </div>
    </div>
  );
};

export default Comparison;
