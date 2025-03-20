import React, { useState, useEffect } from 'react';
import Header from './Header';
import './Renewal.css';

const carModels = {
  Maruti: ['Swift', 'Baleno', 'Alto'],
  Hyundai: ['i10', 'i20', 'Verna'],
  Tata: ['Nexon', 'Tiago', 'Harrier'],
  Kia: ['Seltos', 'Sonet', 'Carnival'],
  Honda: ['City', 'Civic', 'Jazz'],
  Toyota: ['Innova', 'Fortuner', 'Camry'],
};

const Renewal = () => {
  // State declarations must be inside the component function
  const [policyNumber, setPolicyNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    mileage: '',
  });
  const [premiumAmount, setPremiumAmount] = useState(0);
  const [paymentOption, setPaymentOption] = useState('monthly');
  const [policyholderInfo, setPolicyholderInfo] = useState({
    name: '',
    address: '',
    contact: '',
  });
  const [isStepValid, setIsStepValid] = useState(false);
  const [documents, setDocuments] = useState({
    aadhar: null,
    license: null,
    rc: null,
  });
  const [confirmation, setConfirmation] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Fetch insurance plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/plans');
        const data = await response.json();
        setInsurancePlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      const plan = insurancePlans.find(plan => plan._id === selectedPlan);
      if (plan) {
        setPremiumAmount(plan.amount);
      }
    }
  }, [selectedPlan, insurancePlans]);

  const handleMakeChange = (e) => {
    const selectedMake = e.target.value;
    setVehicleDetails({ ...vehicleDetails, make: selectedMake, model: '' });
    setAvailableModels(carModels[selectedMake] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    if (isStepValid) {
        // Prepare the data to be saved
        const renewalPayload = {
            policyNumber,
            vehicleDetails,
            premiumAmount,
            paymentOption,
            policyholderInfo,
            
        };

        try {
            const response = await fetch('http://localhost:5000/api/renewals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(renewalPayload),
            });

            const data = await response.json();
            if (response.ok) {
                // Handle successful submission (confirmation step)
                setConfirmation("Your policy has been renewed!"); // Show confirmation message
                // Optionally, reset the form or redirect as needed
                // resetForm(); // Uncomment if you have a function to reset the form
            } else {
                console.error('Error saving renewal:', data.message);
                setConfirmation('Failed to save renewal: ' + data.message); // Show error message
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setConfirmation('Error submitting form: ' + error.message); // Show error message
        }
    }
};

const calculateTotalAmount = () => {
  let totalAmount = premiumAmount;
  if (paymentOption === 'quarterly') {
    totalAmount *= 3;
  } else if (paymentOption === 'yearly') {
    totalAmount *= 12;
  }
  return totalAmount;
};
const totalAmount = calculateTotalAmount(); // Total amount before GST
const gstAmount = totalAmount * 0.18; // Calculate 18% GST
const totalWithGST = totalAmount + gstAmount; // Total amount including GST

  const handleNext = () => {
    validateStep();
    if (isStepValid && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (isStepValid && currentStep === 6) {
      setConfirmation(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        setIsStepValid(policyNumber.length === 10);
        break;
      case 1:
        setIsStepValid(
          vehicleDetails.make !== '' &&
          vehicleDetails.model !== '' &&
          vehicleDetails.year !== '' &&
          vehicleDetails.licensePlate !== '' &&
          vehicleDetails.mileage !== ''
        );
        break;
      case 2: // Plan selection step
        setIsStepValid(selectedPlan !== '');
        break;
      case 3:
        setIsStepValid(paymentOption !== '');
        break;
      case 4:
        setIsStepValid(
          policyholderInfo.name !== '' &&
          policyholderInfo.address !== '' &&
          policyholderInfo.contact !== ''
        );
        break;
      case 5:
        setIsStepValid(
          documents.aadhar !== null &&
          documents.license !== null &&
          documents.rc !== null
        );
        break;
      case 6:
        setIsStepValid(true);
        break;
      default:
        setIsStepValid(false);
    }
  };

  useEffect(() => {
    validateStep();
  }, [
    currentStep,
    policyNumber,
    vehicleDetails,
    selectedPlan,
    paymentOption,
    policyholderInfo,
    documents
  ]);

  const handlePlanSelection = (e) => {
    setSelectedPlan(e.target.value);
    setIsStepValid(e.target.value !== '');
  };

  

  return (
    <div className="renewal-container1">
      <Header />
      <div className="description-form-container1">
        {/* Description Section */}
        <div className="description1">
          <p>
          <h1>Car Insurance Renewal</h1>
            Car insurance renewal is a crucial process that ensures uninterrupted
            coverage and protection for your vehicle. By renewing your policy, you
            maintain coverage against potential accidents, theft, or damage,
            preventing significant out-of-pocket expenses in the event of
            unforeseen incidents. The renewal process typically includes verifying
            vehicle information, updating personal details, selecting a suitable
            insurance plan, reviewing premium costs, and uploading required
            documentation.
          </p>
          <p>
            During renewal, policyholders can often choose from flexible payment
            options, such as monthly, quarterly, or annual payments, according to
            their budget preferences. Additionally, benefits such as no-claim
            bonus discounts and loyalty rewards may be available for those with a
            claim-free record. Upon completing the renewal process and making the
            required payment, policyholders receive confirmation, ensuring
            continued insurance coverage without interruption.
          </p>
        </div>

        {/* Form Section */}
        <div className="form-section1">
        <h1>Renew Your Policy </h1>

          <div className="progress-bar1">
            <div className="progress1" style={{ width: `${(currentStep / 7) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Policy Details */}
            {currentStep === 0 && (
              <section>
                <h2>Policy Details</h2>
                <label>
                  Current Policy Number:
                  <input
                    type="text"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    required
                    placeholder="Enter your current policy number"
                  />
                </label>
              </section>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 1 && (
              <section>
                <h2>Vehicle Information</h2>
                <label>
                  Make:
                  <select
                    value={vehicleDetails.make}
                    onChange={handleMakeChange}
                    required
                  >
                    <option value="">Select Make</option>
                    {Object.keys(carModels).map(make => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Model:
                  <select
                    value={vehicleDetails.model}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, model: e.target.value })}
                    required
                    disabled={availableModels.length === 0}
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Year:
                  <input
                    type="text"
                    value={vehicleDetails.year}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, year: e.target.value })}
                    required
                  />
                </label>
                <label>
                  License Plate:
                  <input
                    type="text"
                    value={vehicleDetails.licensePlate}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, licensePlate: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Current Mileage:
                  <input
                    type="number"
                    value={vehicleDetails.mileage}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, mileage: e.target.value })}
                    required
                  />
                </label>
              </section>
            )}
            {/* Step 3: Select Insurance Plan */}
            {currentStep === 2 && (
              <section>
                <h2>Select Insurance Plan</h2>
                <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} required>
                  <option value="">Select a plan</option>
                  {insurancePlans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} - Rs.{plan.amount}
                    </option>
                  ))}
                </select>

                {/* Displaying the selected plan details */}
                {selectedPlan && (
                  <div className="plan-details1">
                    <h3>Plan Description</h3>
                    <p>{insurancePlans.find(plan => plan._id === selectedPlan)?.description}</p>
                    <h4>Features:</h4>
                    <ul>
                      {insurancePlans.find(plan => plan._id === selectedPlan)?.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
{currentStep === 3 && (
  <section className="premium-calculation">
    <h2>Premium Calculation</h2>
    <p className="premium-amount">Premium Amount: Rs.{premiumAmount}</p>

    {/* Calculate total amount and GST */}
    <p className="total-amount">Total Amount (excluding GST): Rs.{totalAmount}</p>
    <p className="gst-amount">GST Amount: Rs.{gstAmount.toFixed(2)}</p>
    <p className="total-with-gst">Total Amount (including GST): Rs.{totalWithGST.toFixed(2)}</p>

    <label className="payment-label">
      Payment Breakdown:
      <select value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)} className="payment-select">
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
    </label>
  </section>
)}

            {/* Step 5: Personal Information */}
            {currentStep === 4 && (
              <section>
                <h2>Personal Information</h2>
                <label>
                  Name:
                  <input
                    type="text"
                    value={policyholderInfo.name}
                    onChange={(e) => setPolicyholderInfo({ ...policyholderInfo, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Address:
                  <input
                    type="text"
                    value={policyholderInfo.address}
                    onChange={(e) => setPolicyholderInfo({ ...policyholderInfo, address: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Contact Number:
                  <input
                    type="text"
                    value={policyholderInfo.contact}
                    onChange={(e) => setPolicyholderInfo({ ...policyholderInfo, contact: e.target.value })}
                    required
                  />
                </label>
              </section>
            )}

          {/* Step 6: Documents Upload */}
{currentStep === 5 && (
  <section>
    <h2>Upload Documents</h2>
    <label>
      Aadhar:
      <input
        type="file"
        onChange={(e) => setDocuments({ ...documents, aadhar: e.target.files[0] })}
        required
      />
    </label>
    <label>
      License:
      <input
        type="file"
        onChange={(e) => setDocuments({ ...documents, license: e.target.files[0] })}
        required
      />
    </label>
    <label>
      RC:
      <input
        type="file"
        onChange={(e) => setDocuments({ ...documents, rc: e.target.files[0] })}
        required
      />
    </label>
    {/* Display uploaded document names */}
    <ul>
      {documents.aadhar && <li>Aadhar: {documents.aadhar.name}</li>}
      {documents.license && <li>License: {documents.license.name}</li>}
      {documents.rc && <li>RC: {documents.rc.name}</li>}
    </ul>
  </section>
)}
{currentStep === 6 && (
  <section className="confirmation-section">
    <h2 className="confirmation-title">Confirmation</h2>
    <p className="confirmation-description">Review your details below:</p>
    <ul className="confirmation-details">
      <li>Policy Number: {policyNumber}</li>
      <li>Vehicle Make: {vehicleDetails.make}, Model: {vehicleDetails.model}</li>
      <li>Year: {vehicleDetails.year}</li>
      <li>License Plate: {vehicleDetails.licensePlate}</li>
      <li>Mileage: {vehicleDetails.mileage}</li>
      <li>Policyholder Name: {policyholderInfo.name}</li>
      <li>Selected Plan: {insurancePlans.find(plan => plan._id === selectedPlan)?.name}</li>
    </ul>

    <div className="payment-summary">
      <h3 className="payment-summary-title">Payment Summary</h3>
      <div className="payment-details">
        <table className="payment-table">
          <tbody>
            <tr>
              <td>Base Premium Amount:</td>
              <td>Rs.{premiumAmount}</td>
            </tr>
            <tr>
              <td>Payment Frequency:</td>
              <td>{paymentOption.charAt(0).toUpperCase() + paymentOption.slice(1)}</td>
            </tr>
            <tr>
              <td>Payment Breakdown:</td>
              <td>
                {paymentOption === 'monthly' && `Rs.${premiumAmount} per month`}
                {paymentOption === 'quarterly' && `Rs.${premiumAmount * 3} per quarter`}
                {paymentOption === 'yearly' && `Rs.${premiumAmount * 12} per year`}
              </td>
            </tr>
            <tr>
              <td>GST (18%):</td>
              <td>Rs.{(calculateTotalAmount() * 0.18).toFixed(2)}</td>
            </tr>
            <tr className="total-amount">
              <td>Total Amount (including GST):</td>
              <td>Rs.{(calculateTotalAmount() + calculateTotalAmount() * 0.18).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="terms-and-conditions">
      <p>By clicking submit, you confirm that:</p>
      <ul>
        <li>All the above details are correct</li>
        <li>You agree to the payment schedule outlined above</li>
        <li>You accept the terms and conditions of the selected insurance plan</li>
      </ul>
    </div>
  </section>
)}

<div className="buttons1">
  <button type="button" onClick={handleBack} disabled={currentStep === 0}>
    Back
  </button>
  {currentStep < 6 ? ( <button type="button" onClick={handleNext}>
      Next
    </button>
  ) : (
    <button type="submit">Submit</button>
  )}
</div>
</form>
{confirmation && <div className="confirmation-message">{confirmation}</div>}
</div>
</div>
</div>
);
};

export default Renewal;
