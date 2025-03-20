import React, { useState } from 'react';
import './HealthInsuranceCalc.css';

function HealthInsuranceCalculator() {
  // Basic Information
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [smoking, setSmoking] = useState('no');
  const [occupation, setOccupation] = useState('');

  // Coverage Details
  const [sumInsured, setSumInsured] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [roomRentLimit, setRoomRentLimit] = useState('');
  const [addOnCovers, setAddOnCovers] = useState([]);

  // Health Information
  const [preExistingConditions, setPreExistingConditions] = useState('no');
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState('');

  // Calculated Coverage
  const [recommendedCoverage, setRecommendedCoverage] = useState(null);

  const handleAddOnCoversChange = (event) => {
    const value = event.target.value;
    setAddOnCovers(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const calculateCoverage = () => {
    // Simple calculation logic for demonstration
    const baseCoverage = 5000;
    const ageFactor = age > 40 ? 1.5 : 1;
    const smokingFactor = smoking === 'yes' ? 1.2 : 1;
    const locationFactor = location === 'urban' ? 1.1 : 1;
    const preExistingConditionsFactor = preExistingConditions === 'yes' ? 2 : 1;
    const sumInsuredFactor = sumInsured / 100000;
    
    const coverage = baseCoverage * ageFactor * smokingFactor * locationFactor * preExistingConditionsFactor * sumInsuredFactor;
    setRecommendedCoverage(coverage.toFixed(2));
  };

  return (
    <div className="calculator-section">
      <h3>Health Insurance Calculator</h3>
      <div className="calculator-form">
        {/* Basic Information */}
        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Location:</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          <option value="urban">Urban</option>
          <option value="rural">Rural</option>
        </select>

        <label>Smoking/Tobacco Use:</label>
        <select value={smoking} onChange={(e) => setSmoking(e.target.value)}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        <label>Occupation:</label>
        <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />

        {/* Coverage Details */}
        <label>Sum Insured:</label>
        <input type="number" value={sumInsured} onChange={(e) => setSumInsured(e.target.value)} />

        <label>Policy Type:</label>
        <select value={policyType} onChange={(e) => setPolicyType(e.target.value)}>
          <option value="">Select Policy Type</option>
          <option value="individual">Individual</option>
          <option value="family">Family Floater</option>
          <option value="senior">Senior Citizen</option>
        </select>

        <label>Room Rent Limit:</label>
        <input type="number" value={roomRentLimit} onChange={(e) => setRoomRentLimit(e.target.value)} />

        <label>Add-on Covers:</label>
        <div>
          <input
            type="checkbox"
            value="criticalIllness"
            checked={addOnCovers.includes('criticalIllness')}
            onChange={handleAddOnCoversChange}
          />
          <label>Critical Illness</label>
          <input
            type="checkbox"
            value="maternity"
            checked={addOnCovers.includes('maternity')}
            onChange={handleAddOnCoversChange}
          />
          <label>Maternity</label>
          {/* Add more checkboxes as needed */}
        </div>

        {/* Health Information */}
        <label>Pre-existing Conditions:</label>
        <select value={preExistingConditions} onChange={(e) => setPreExistingConditions(e.target.value)}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        <label>Family Medical History:</label>
        <textarea value={familyMedicalHistory} onChange={(e) => setFamilyMedicalHistory(e.target.value)} />

        <button type="button" onClick={calculateCoverage}>Calculate Coverage</button>

        {recommendedCoverage && (
          <div className="calculator-result">
            Recommended Coverage: ${recommendedCoverage}
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthInsuranceCalculator;
