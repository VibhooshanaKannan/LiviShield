import React, { useState, useEffect } from 'react';
import './Plans.css'; // Ensure your styles are in Plans.css
import ProposalForm from './ProposalForm'; // Import ProposalForm
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const [activeType, setActiveType] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // State to track selected plan
  const [plans, setPlans] = useState([]);
  const [comparePlans, setComparePlans] = useState([]); // Track plans to compare
  const [message, setMessage] = useState(''); // State for comparison message
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/carPlans'); // Replace with your backend URL
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = activeType === 'all' ? plans : plans.filter(plan => plan.type === activeType);
  const displayedPlans = showAll ? filteredPlans : filteredPlans.slice(0, 4);

  // Function to handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan); // Set the selected plan
  };

  const handleBack = () => {
    setSelectedPlan(null); // Go back to the plans list
  };

  // Function to handle comparing plans, limit to two
  const handleComparePlan = (plan) => {
    if (comparePlans.length >= 2) {
      alert(" You can only compare two plans! Remove one if ye want to add another.");
      return; // Limit to two plans
    }
    if (!comparePlans.some(p => p.name === plan.name)) {
      setComparePlans((prevPlans) => [...prevPlans, plan]); // Add plan to comparison list
      setMessage(''); // Clear message on new selection
    }
  };

  // Function to navigate to the comparison page
  const handleCompareNow = () => {
    if (comparePlans.length === 2) {
      navigate('/comparison', { state: { comparePlans } }); // Navigate to Comparison page with selected plans
    } else {
      setMessage(" You need to select exactly two plans to compare!"); // Set message if not two plans
    }
  };

  // Function to remove a plan from comparison
  const handleRemoveCompare = (plan) => {
    setComparePlans((prevPlans) => prevPlans.filter(p => p.name !== plan.name)); // Remove plan from comparison list
    setMessage(''); // Clear message on removal
  };

  


  return (
    <div className="plans-container">
      {selectedPlan ? (
        <div>
          <button onClick={handleBack}>Back to Plans</button> {/* Back Button */}
          <ProposalForm plan={selectedPlan} /> {/* Render ProposalForm with selected plan */}
        </div>
      ) : (
        <>
          <h1>Find the perfect fit for your driving needs</h1>
          <div className="plan-options">
            <button className={`plan-type-btn ${activeType === 'all' ? 'active' : ''}`} onClick={() => setActiveType('all')}>All Plans</button>
            <button className={`plan-type-btn ${activeType === 'comprehensive' ? 'active' : ''}`} onClick={() => setActiveType('comprehensive')}>Comprehensive</button>
            <button className={`plan-type-btn ${activeType === 'third-party' ? 'active' : ''}`} onClick={() => setActiveType('third-party')}>Third Party</button>
            <button className={`plan-type-btn ${activeType === 'own-damage' ? 'active' : ''}`} onClick={() => setActiveType('own-damage')}>Own Damage</button>
          </div>

          {/* Plans List */}
          <div className="plans-list">
            {displayedPlans.map((plan, index) => (
              <div className="plan-card" key={index} data-type={plan.type}>
                <div className="plan-header">
                  <div className="plan-name-type">
                    <h3>{plan.name}</h3>
                    <div className="plan-type">Type: {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}</div>
                  </div>
                  <div className="cost">Rs.{plan.amount}</div>
                </div>
                <div className="plan-body">
                  <div className="features">
                    <h4>Features</h4>
                    <ul>
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="claim-benefits">
                    <h4>Claim Benefits</h4>
                    <ul>
                      {plan.claimBenefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="plan-actions">
                  <button className="get-plan-btn" onClick={() => handlePlanSelect(plan)}>
                    Get This Plan
                  </button>
                  <button className="compare-plan-btn" onClick={() => handleComparePlan(plan)}> {/* Add to compare list */}
                    Select  for Comparison
                  </button>
                  {comparePlans.some(p => p.name === plan.name) && (
                    <button className="remove-compare-btn" onClick={() => handleRemoveCompare(plan)}>
                      Remove From Comparison
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="view-more">
            <button onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'View More'}
            </button>
          </div>

          {/* Display message if two plans are selected */}
          {comparePlans.length === 2 && (
            <p className="compare-message">You have selected two plans! Click below to compare!</p>
          )}

          <div className="compare-section">
            <button 
              className="compare-now-btn" 
              onClick={handleCompareNow} 
              disabled={comparePlans.length < 2} // Disable if less than 2 plans
            >
              Compare Selected Plans ({comparePlans.length})
            </button>
          </div>

          {message && <p className="compare-message">{message}</p>} {/* Display error message if needed */}
        </>
      )}
    </div>
  );
};
export default Plans;
