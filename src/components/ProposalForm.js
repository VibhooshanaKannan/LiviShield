import React, { useState, useRef } from 'react';
import './ProposalForm.css';
import { useNavigate } from 'react-router-dom';
import Plans from './Plans';

const ProposalForm = ({ plan }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    dob: '',
    aadhaar: '',
    houseNumber: '',
    streetName: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    carMake: '',
    carModel: '',
    carYear: '',
    carLicensePlate: '',
    fuelType: '',
    idv: '', // Store IDV in formData
    coverageType: '',
    addOns: [],
    modifications: '',
    healthConditions: '',
    medications: '',
    accidents: '',
    licenseSuspension: '',
    declaration: false,
  });

  const carModels = {
    Maruti: ['Swift', 'Baleno', 'Alto'],
    Hyundai: ['i10', 'i20', 'Verna'],
    Tata: ['Nexon', 'Tiago', 'Harrier'],
    Kia: ['Seltos', 'Sonet', 'Carnival'],
    Honda: ['City', 'Civic', 'Jazz'],
    Toyota: ['Innova', 'Fortuner', 'Camry'],
  };

  const carPrices = {
    Maruti: { Swift: 599000, Baleno: 661000, Alto: 399000 },
    Hyundai: { i10: 509000, i20: 736000, Verna: 1096000 },
    Tata: { Nexon: 810000, Tiago: 559000, Harrier: 1519000 },
    Kia: { Seltos: 1090000, Sonet: 779000, Carnival: 3099000 },
    Honda: { City: 1163000, Civic: 1793000, Jazz: 811000 },
    Toyota: { Innova: 1999000, Fortuner: 3399000, Camry: 4617000 }
  };

  const [summaryVisible, setSummaryVisible] = useState(false);
  const summaryRef = useRef(null);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = React.useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "addOns") {
      // Handle the 'addOns' array separately
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          addOns: [...prevData.addOns, value], // Add the selected add-on
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          addOns: prevData.addOns.filter((addOn) => addOn !== value), // Remove the unchecked add-on
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked, // Handle single checkboxes
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Calculate IDV whenever carMake, carModel, or carYear changes
    if (['carMake', 'carModel', 'carYear'].includes(name)) {
      const newIdv = calculateIDV({ ...formData, [name]: value });
      setFormData((prevData) => ({
        ...prevData,
        idv: newIdv, // Update IDV in formData
      }));
    }
  };

  const calculateDepreciation = (carYear) => {
    const age = 2024 - carYear;
    if (age <= 0.5) return 0.05;
    if (age <= 1) return 0.15;
    if (age <= 2) return 0.20;
    if (age <= 3) return 0.30;
    if (age <= 4) return 0.40;
    if (age <= 5) return 0.50;
    return 0.60; // For cars older than 5 years, assume 60% depreciation.
  };

  const calculateIDV = (formData) => {
    const { carMake, carModel, carYear } = formData;
    if (!carMake || !carModel || !carYear) return ''; // Return empty if any field is missing.

    const exShowroomPrice = carPrices[carMake][carModel];
    const depreciation = calculateDepreciation(carYear);
    const idv = exShowroomPrice * (1 - depreciation);

    return idv ? `₹${idv.toLocaleString()}` : ''; // Format IDV as currency with commas.
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Proceed to car details step
  };

  const handleCarDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Proceed to coverage details step
  };

  const handleCoverageDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(4); // Proceed to health and safety questions step
  };

  const handleHealthSafetySubmit = (e) => {
    e.preventDefault();
    setStep(5); // Proceed to declaration step
  };

  const handleDeclarationSubmit = async (e) => {
    e.preventDefault();
    const selectedPlan = plan; // Make sure 'plan' contains the selected plan details

    try {
      const response = await fetch('http://localhost:5000/carProposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, idv: calculateIDV(formData) }), // Send IDV in proposal
      });

      if (response.ok) {
        console.log('Proposal submitted successfully!');
        setSubmitted(true);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          dob: '',
          aadhaar: '',
          houseNumber: '',
          streetName: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          carMake: '',
          carModel: '',
          carYear: '',
          carLicensePlate: '',
          fuelType: '',
          idv: '', // Reset IDV
          coverageType: '',
          addOns: [],
          modifications: '',
          healthConditions: '',
          medications: '',
          accidents: '',
          licenseSuspension: '',
          declaration: false,
        });
        setStep(1); // Reset to the first step
        navigate('/carsummary', { state: { formData, selectedPlan } });
      } else {
        console.error('Failed to submit proposal');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="proposal-container">
      <div className="proposal-details">
        <h2>Proposal for {plan.name}</h2>
        <p><strong>Type:</strong> {plan.type}</p>
        <p><strong>Amount:</strong> Rs. {plan.amount}</p>
        <h4>Features:</h4>
        <ul>
          {plan.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <h4>Claim Benefits:</h4>
        <ul>
          {plan.claimBenefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>

      {step === 1 && (
        <form className="proposal-form" onSubmit={handlePersonalInfoSubmit}>
          <h3>Personal Information</h3>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={50}
            pattern="[A-Za-z\s]+"
            title="Full name must contain only letters and spaces."
          />
          <h4>Contact Information</h4>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="^\d{10}$"
            title="Phone number must be exactly 10 digits."
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <h4>Residential Address</h4>
          <label htmlFor="houseNumber">House/Flat Number:</label>
          <input
            type="text"
            id="houseNumber"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            required
            minLength={1}
            maxLength={10}
          />
          <label htmlFor="streetName">Street Name:</label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            value={formData.streetName}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={50}
          />
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={30}
            pattern="[A-Za-z\s]+"
            title="City must contain only letters and spaces."
          />
          <label htmlFor="state">State/Province:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={30}
            pattern="[A-Za-z\s]+"
            title="State/Province must contain only letters and spaces."
          />
          <label htmlFor="postalCode">Postal/ZIP Code:</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            pattern="^\d{6}$"
            title="Postal code must be exactly 6 digits."
          />
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={30}
            pattern="[A-Za-z\s]+"
            title="Country must contain only letters and spaces."
          />
          <h4>Date of Birth</h4>
          <label htmlFor="dob">DOB:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <h4>Identity Proof</h4>
          <label htmlFor="aadhaar">Aadhaar Number:</label>
          <input
            type="text"
            id="aadhaar"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
            required
            pattern="^\d{12}$"
            title="Aadhaar number must be exactly 12 digits."
          />
          <button type="submit">Next: Car Details</button>
        </form>
      )}

      {step === 2 && (
        <form className="proposal-form" onSubmit={handleCarDetailsSubmit}>
          <h3>Car Details</h3>
          <label htmlFor="carMake">Car Make:</label>
      <select
        id="carMake"
        name="carMake"
        value={formData.carMake}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Car Brand</option>
        <option value="Maruti">Maruti</option>
        <option value="Hyundai">Hyundai</option>
        <option value="Tata">Tata</option>
        <option value="Kia">Kia</option>
        <option value="Honda">Honda</option>
        <option value="Toyota">Toyota</option>
      </select>

      <label htmlFor="carModel">Car Model:</label>
      <select
        id="carModel"
        name="carModel"
        value={formData.carModel}
        onChange={handleChange}
        required
        disabled={!formData.carMake} // Disable if no car make is selected
      >
        <option value="" disabled>Select Car Model</option>
        {formData.carMake && carModels[formData.carMake].map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
          <label htmlFor="carYear">Car Year:</label>
          <input
            type="number"
            id="carYear"
            name="carYear"
            value={formData.carYear}
            onChange={handleChange}
            required
            min={1900}
            max={new Date().getFullYear()} // Restrict to valid years
          />
          <label htmlFor="carLicensePlate">License Plate:</label>
          <input
            type="text"
            id="carLicensePlate"
            name="carLicensePlate"
            value={formData.carLicensePlate}
            onChange={handleChange}
            required
            pattern="^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$"
            title="License Plate must be in the format 'TN47B5099'."
          />
          <label htmlFor="fuelType">Fuel Type:</label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>

           
         <label htmlFor="idv">IDV (Insured Declared Value):</label>
      <input
        type="text"
        id="idv"
        name="idv"
        value={calculateIDV(formData)}
        onChange={handleChange}
        required
      />

          <button type="submit">Next: Coverage Details</button>
        </form>
      )}

      {step === 3 && (
        <form className="proposal-form" onSubmit={handleCoverageDetailsSubmit}>
          <h3>Coverage Details</h3>
          <label htmlFor="coverageType">Coverage Type:</label>
          <select
            id="coverageType"
            name="coverageType"
            value={formData.coverageType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Coverage Type</option>
            <option value="Basic">Basic</option>
            <option value="Third Party">Third Party</option>
            <option value="Comprehensive">Comprehensive</option>
          </select>

          <h4>Add-Ons</h4>
          <label>
            <input
              type="checkbox"
              name="addOns"
              value="Zero Depreciation"
              checked={formData.addOns.includes('Zero Depreciation')}
              onChange={handleChange}
            />
            Zero Depreciation
          </label>
          <label>
            <input
              type="checkbox"
              name="addOns"
              value="Roadside Assistance"
              checked={formData.addOns.includes('Roadside Assistance')}
              onChange={handleChange}
            />
            Roadside Assistance
          </label>
          <label>
            <input
              type="checkbox"
              name="addOns"
              value="Engine Protection"
              checked={formData.addOns.includes('Engine Protection')}
              onChange={handleChange}
            />
            Engine Protection
          </label>
          <button type="submit">Next: Health and Safety Questions</button>
        </form>
      )}

      {step === 4 && (
        <form className="proposal-form" onSubmit={handleHealthSafetySubmit}>
          <h3>Health and Safety Questions</h3>
          <label>Have you made any modifications to your vehicle?</label>
          <label>
            <input
              type="radio"
              name="modifications"
              value="Yes"
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="modifications"
              value="No"
              onChange={handleChange}
              required
            />
            No
          </label>

          <label>Do you have any pre-existing health conditions that may affect your driving abilities?</label>
          <label>
            <input
              type="radio"
              name="healthConditions"
              value="Yes"
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="healthConditions"
              value="No"
              onChange={handleChange}
              required
            />
            No
          </label>

          <label>Are you currently taking any medications that could impair your driving skills?</label>
          <label>
            <input
              type="radio"
              name="medications"
              value="Yes"
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="medications"
              value="No"
              onChange={handleChange}
              required
            />
            No
          </label>

          <label>Have you ever been involved in a vehicular accident attributed to a health issue?</label>
          <label>
            <input
              type="radio"
              name="accidents"
              value="Yes"
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="accidents"
              value="No"
              onChange={handleChange}
              required
            />
            No
          </label>

          <label>Has your driving license ever been suspended due to medical reasons?</label>
          <label>
            <input
              type="radio"

              name="licenseSuspension"
              value="Yes"
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="licenseSuspension"
              value="No"
              onChange={handleChange}
              required
            />
            No
          </label>
          <button type="submit">Next: Declaration</button>
        </form>
      )}
    {step === 5 && (
        <form className="proposal-form" onSubmit={handleDeclarationSubmit}>
          <h3>Declaration</h3>
          <p>
            Please read the following declaration carefully before submitting your proposal:
          </p>
          <p>
            I, the undersigned, hereby declare that the information provided in this insurance proposal form is complete, accurate, and true to the best of my knowledge and belief. I understand that any misrepresentation or omission of facts may lead to the denial of coverage or cancellation of the policy by the insurer.
          </p>
          <p>
            I acknowledge that I have read and understood the terms and conditions associated with this insurance policy. I am aware that providing false information or failing to disclose relevant facts could result in severe consequences, including but not limited to:
          </p>
          <ul>
            <li><strong>Rejection of Claims:</strong> Any claims submitted may be denied based on inaccuracies in the information provided.</li>
            <li><strong>Policy Cancellation:</strong> The insurer reserves the right to cancel the policy if misrepresentation is discovered.</li>
            <li><strong>Legal Action:</strong> The insurer may pursue legal action if fraudulent activities are detected.</li>
          </ul>
          <label>
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              required
            />
             I declare that the information provided is true and complete to the best of my knowledge.
             </label>
          <button type="submit">Submit Proposal</button>
        </form>
      )}
      
      {submitted && (
                <div className="success-message">
                    <h2>Proposal Submitted Successfully!</h2>
                    <button onClick={() => navigate('/carsummary')}>View Summary</button>
        </div>
      )}

    </div>
  );
};

export default ProposalForm;
