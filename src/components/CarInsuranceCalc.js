import React, { useState } from 'react';
import './CarInsuranceCalc.css';

function CarInsuranceCalculator() {
  // Basic Information
  const [carModel, setCarModel] = useState('');
  const [manufactureYear, setManufactureYear] = useState('');
  const [location, setLocation] = useState('');
  const [driverAge, setDriverAge] = useState('');
  const [drivingExperience, setDrivingExperience] = useState('');
  const [previousClaims, setPreviousClaims] = useState('no');

  // Coverage Details
  const [sumInsured, setSumInsured] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [addOnCovers, setAddOnCovers] = useState([]);

  // Calculated Premium
  const [calculatedPremium, setCalculatedPremium] = useState(null);

  const handleAddOnCoversChange = (event) => {
    const value = event.target.value;
    setAddOnCovers(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const calculatePremium = () => {
    // Simple calculation logic for demonstration
    const basePremium = 2000;
    const carAgeFactor = manufactureYear < 2015 ? 1.2 : 1;
    const locationFactor = location === 'urban' ? 1.1 : 1;
    const driverAgeFactor = driverAge > 50 ? 1.3 : 1;
    const previousClaimsFactor = previousClaims === 'yes' ? 1.5 : 1;
    const sumInsuredFactor = sumInsured / 100000;

    const premium = basePremium * carAgeFactor * locationFactor * driverAgeFactor * previousClaimsFactor * sumInsuredFactor;
    setCalculatedPremium(premium.toFixed(2));
  };

  return (
    <div className="calculator-section">
      <h3>Car Insurance Premium Calculator</h3>
      <div className="calculator-form">
        {/* Basic Information */}
        <label>Car Model:</label>
        <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} />

        <label>Manufacture Year:</label>
        <input type="number" value={manufactureYear} onChange={(e) => setManufactureYear(e.target.value)} />

        <label>Location:</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          <option value="urban">Urban</option>
          <option value="rural">Rural</option>
        </select>

        <label>Driver Age:</label>
        <input type="number" value={driverAge} onChange={(e) => setDriverAge(e.target.value)} />

        <label>Driving Experience (Years):</label>
        <input type="number" value={drivingExperience} onChange={(e) => setDrivingExperience(e.target.value)} />

        <label>Previous Claims:</label>
        <select value={previousClaims} onChange={(e) => setPreviousClaims(e.target.value)}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        {/* Coverage Details */}
        <label>Sum Insured:</label>
        <input type="number" value={sumInsured} onChange={(e) => setSumInsured(e.target.value)} />

        <label>Policy Type:</label>
        <select value={policyType} onChange={(e) => setPolicyType(e.target.value)}>
          <option value="">Select Policy Type</option>
          <option value="thirdParty">Third Party</option>
          <option value="comprehensive">Comprehensive</option>
        </select>

        <label>Add-on Covers:</label>
        <div>
          <input
            type="checkbox"
            value="zeroDep"
            checked={addOnCovers.includes('zeroDep')}
            onChange={handleAddOnCoversChange}
          />
          <label>Zero Depreciation</label>

          <input
            type="checkbox"
            value="engineProtection"
            checked={addOnCovers.includes('engineProtection')}
            onChange={handleAddOnCoversChange}
          />
          <label>Engine Protection</label>

          <input
            type="checkbox"
            value="roadsideAssistance"
            checked={addOnCovers.includes('roadsideAssistance')}
            onChange={handleAddOnCoversChange}
          />
          <label>Roadside Assistance</label>
        </div>

        <button type="button" onClick={calculatePremium}>Calculate Premium</button>

        {calculatedPremium && (
          <div className="calculator-result">
            Estimated Premium: ${calculatedPremium}
          </div>
        )}
      </div>
    </div>
  );
}

export default CarInsuranceCalculator;
