import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Plans from './Plans';
import Need from './Need';
import './CarInsurance.css';
import Header from './Header';

const CarInsurance = () => {
  const [step, setStep] = useState(1);
  const [carLicensePlate, setCarLicensePlate] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const navigate = useNavigate();

  const handleViewPlans = () => {
    navigate('/plans'); // Adjust the path based on your routing setup
};

  // Handle form step change
  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName,
      phone,
      carMake,
      carModel,
      carLicensePlate,
      fuelType,
    };

    try {
      const response = await fetch('http://localhost:5000/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Proposal submitted successfully! ID: ' + result.id);
        // Navigate to the ProposalForm with the ID
        navigate(`/proposalform/${result.id}`); // Adjust the path based on yer routing setup
      } else {
        alert('Failed to submit proposal');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="car-insurance-container">
      <div className="background-overlay">
        <Header />
        <div className="form-section">
          <div className="quote">Protect Your Car with the Best Insurance Plans</div>
          <div className="quote-description">
            Find the perfect car insurance plan that fits yer needs and budget.
          </div>

          {/* Additional Sections */}
          <div className="info-section">
            <div className="description-text">
              <h1>CAR INSURANCE</h1>
              <p>
                Car insurance provides financial protection to yer car if it suffers damages due to road accidents, natural disasters, theft, and fire. With a comprehensive car insurance policy, ye can get covered in case of unforeseen losses to yer vehicle and third-party liabilities such as third-party death and property damages. A valid car insurance policy also ensures that ye comply with the motor laws of India.
              </p>
            </div>
            <div className="policy-card">
              <h3>Why buy from <span className="highlight">LIVISHIELD?</span></h3>
              <ul className="benefits-list">
                <li><span className="checkmark">✔</span> 24x7 claims assistance <span className="new-badge">New</span></li>
                <li><span className="checkmark">✔</span> Quick and easy claims process</li>
                <li><span className="checkmark">✔</span> Affordable premiums</li>
                <li><span className="checkmark">✔</span> Coverage for damages</li>
                <li><span className="checkmark">✔</span> Personal accident cover</li>
              </ul>
              <button className="view-plans-btn" onClick={handleViewPlans}>
    View Plans
</button>

            </div>
          </div>
          <Plans />
          <Need />
        

        </div>
      </div>
    </div>
  );
};

export default CarInsurance;
