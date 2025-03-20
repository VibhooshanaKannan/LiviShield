import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth
import axios from 'axios';
import './FamilyHealthInsurancePage.css';

function FamilyHealthInsurancePage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ coverage: '', minPremium: '', maxPremium: '' });
  const [selectedPlansForComparison, setSelectedPlansForComparison] = useState([]);
  const [policyPeriod, setPolicyPeriod] = useState(1);
  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const navigate = useNavigate();

  const { authState } = useAuth(); // Use authentication context

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/familyhealthinsuranceplans');
        setPlans(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    calculatePremium();
  }, [policyPeriod, selectedPlan]);

  const filteredPlans = plans
    .filter(plan => plan.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(plan =>
      (!filter.coverage || Object.keys(plan.coverage).includes(filter.coverage)) &&
      (!filter.minPremium || plan.premium >= filter.minPremium) &&
      (!filter.maxPremium || plan.premium <= filter.maxPremium)
    );

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });
  const handleOpenModal = (plan) => setSelectedPlan(plan);
  const handleCloseModal = () => {
    setSelectedPlan(null);
    setPolicyPeriod(1);
    setCalculatedPremium(null);
    setShowDetailsModal(false);
  };

  const handleComparePlans = () => {
    if (selectedPlansForComparison.length < 2) {
      alert("Please select at least two plans for comparison.");
      return;
    }
    setShowComparison(true);
  };

  const handleSelectPlanForComparison = (plan) => {
    setSelectedPlansForComparison(prevSelectedPlans =>
      prevSelectedPlans.includes(plan)
        ? prevSelectedPlans.filter(p => p !== plan)
        : [...prevSelectedPlans, plan]
    );
  };

  const handlePolicyPeriodChange = (e) => setPolicyPeriod(Number(e.target.value));

  const calculatePremium = () => {
    if (!selectedPlan) return;

    const basePremium = selectedPlan.premium;
    const premiumFactor = policyPeriod;
    const newPremium = basePremium * premiumFactor;

    setCalculatedPremium(newPremium);
  };

  const handleProceedToProposal = () => {
    if (!authState) {
      navigate('/signin');
      return;
    }

    console.log("Proceeding to proposal with plan:", selectedPlan, "and premium:", calculatedPremium);
    navigate('/proposal', {
      state: {
        selectedPlan,
        calculatedPremium,
      },
    });
  };

  
  const handleProceedButtonClick = () => {
    setShowDetailsModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="family-health-insurance-page">
      <section className="hero-section2">
        <div className="hero-content2">
          <h1>Find the Best Family Health Insurance Plan</h1>
          <p>Your health is important. Explore our comprehensive plans to protect your family.</p>
        </div>
      </section>

      <div className="content-wrapper">
        <div className="main-content">
          <div className="filters">
            <input
              type="text"
              placeholder="Search plans"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select name="coverage" onChange={handleFilterChange}>
              <option value="">All Coverages</option>
              <option value="hospitalization">Hospitalization</option>
              <option value="maternity_benefits">Maternity Benefits</option>
              {/* Add other coverage options here */}
            </select>
            <input
              type="number"
              name="minPremium"
              placeholder="Min Premium"
              value={filter.minPremium}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="maxPremium"
              placeholder="Max Premium"
              value={filter.maxPremium}
              onChange={handleFilterChange}
            />
            <button onClick={handleComparePlans} className="compare-button">Compare Plans</button>
          </div>

          <div className="plan-list">
            {filteredPlans.map(plan => (
              <div
                className={`plan-card ${selectedPlansForComparison.includes(plan) ? 'selected' : ''}`}
                key={plan._id}
                onClick={() => handleOpenModal(plan)}
              >
                <h2>{plan.name}</h2>
                <p><strong>Coverage:</strong></p>
                <ul>
                  {Object.keys(plan.coverage).map((key) => (
                    plan.coverage[key] && <li key={key}>{key.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
                <p><strong>Additional Features:</strong></p>
                <ul>
                  {Object.keys(plan.additional_features).map((key) => (
                    plan.additional_features[key] && <li key={key}>{key.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
                <p><strong>Sum Insured:</strong> {plan.sum_insured}</p>
                <p><strong>Premium:</strong> {plan.premium}</p>
                <button onClick={() => handleSelectPlanForComparison(plan)} className="compare-toggle">
                  {selectedPlansForComparison.includes(plan) ? 'Deselect' : 'Select'} for Comparison
                </button>
              </div>
            ))}
          </div>

          {selectedPlan && !showDetailsModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <h2>{selectedPlan.name}</h2>
                <p><strong>Coverage Details:</strong></p>
                <ul>
                  {Object.keys(selectedPlan.coverage).map((key) => (
                    selectedPlan.coverage[key] && <li key={key}>{key.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
                <p><strong>Additional Features:</strong></p>
                <ul>
                  {Object.keys(selectedPlan.additional_features).map((key) => (
                    selectedPlan.additional_features[key] && <li key={key}>{key.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
                <p><strong>Sum Insured:</strong> {selectedPlan.sum_insured}</p>
                <p><strong>Premium:</strong> {selectedPlan.premium}</p>
                <p><strong>Network Hospitals:</strong></p>
                <ul>
                  {selectedPlan.network_hospitals.map((hospital, index) => (
                    <li key={index}>{hospital}</li>
                  ))}
                </ul>
                <p><strong>Co-payment:</strong> {selectedPlan.co_payment}%</p>
                <p><strong>Waiting Period:</strong></p>
                <ul>
                  <li><strong>Pre-existing Diseases:</strong> {selectedPlan.waiting_period.pre_existing_diseases} months</li>
                  <li><strong>Maternity:</strong> {selectedPlan.waiting_period.maternity} months</li>
                  <li><strong>Critical Illness:</strong> {selectedPlan.waiting_period.critical_illness} months</li>
                </ul>
                <p><strong>Exclusions:</strong></p>
                <ul>
                  {selectedPlan.exclusions.map((exclusion, index) => (
                    <li key={index}>{exclusion}</li>
                  ))}
                </ul>

                {/* Policy Period Selection and Premium Calculation */}
                <div className="policy-period-selection">
                  <label>Select Policy Period:</label>
                  <div className="duration-options">
                    {[1, 2, 3].map((year) => (
                      <button
                        key={year}
                        className={`duration-button ${policyPeriod === year ? 'active' : ''}`}
                        onClick={() => setPolicyPeriod(year)}
                      >
                        {year} Year{year > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <p><strong>Calculated Premium:</strong> {calculatedPremium}</p>
                <button className="pbut" onClick={handleProceedToProposal}>Proceed to Proposal</button>
              </div>
            </div>
          )}

          {showDetailsModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>&times;</span>
                {/* Add any additional details or options related to proposal */}
                <button className="pbut" onClick={handleProceedToProposal}>Proceed to Proposal</button>
              </div>
            </div>
          )}

{showComparison && (
  <>
    <div className="modal-overlay" onClick={() => setShowComparison(false)}></div>
    <div className="comparison-modal">
      <div className="modal-content">
        <span className="close" onClick={() => setShowComparison(false)}>&times;</span>
        <h2>Compare Selected Plans</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              {selectedPlansForComparison.map((plan, index) => (
                <th key={index}>{plan.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sum Insured</td>
              {selectedPlansForComparison.map((plan, index) => (
                <td key={index}>{plan.sum_insured}</td>
              ))}
            </tr>
            <tr>
              <td>Premium</td>
              {selectedPlansForComparison.map((plan, index) => (
                <td key={index}>{plan.premium}</td>
              ))}
            </tr>

            <tr>
              <td>Co-Payment</td>
              {selectedPlansForComparison.map((plan, index) => (
                <td key={index}>{plan.co_payment}</td>
              ))}
            </tr>

            
            {/* Add more rows as needed for other features */}
          </tbody>
        </table>
      </div>
    </div>
  </>
)}

        </div>
      </div>
    </div>
  );
}

export default FamilyHealthInsurancePage;
