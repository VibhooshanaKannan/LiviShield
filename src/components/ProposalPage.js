import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth from AuthProvider
import './ProposalPage.css'; // Add your custom CSS here


function ProposalPage() {
  const navigate = useNavigate();


  const { authState } = useAuth(); // Get the authState from context


  const [step, setStep] = useState(1);
  const [personalDetails, setPersonalDetails] = useState({});
  const [medicalQuestions, setMedicalQuestions] = useState({});
  const [nomineeDetails, setNomineeDetails] = useState({});


  const location = useLocation();
  const { selectedPlan, calculatedPremium } = location.state || {};


  const handlePersonalDetailsChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handleMedicalQuestionsChange = (e) => {
    setMedicalQuestions({ ...medicalQuestions, [e.target.name]: e.target.value });
  };

  const handleNomineeDetailsChange = (e) => {
    setNomineeDetails({ ...nomineeDetails, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {

    console.log('Auth State in Proposal Page:', authState); // Log the auth state

    console.log('authState:', authState);

    try {
      
      if (!authState || !authState.userInfo) {
        console.error('User info is not available');
        
      navigate('/signin'); // Redirect to login page if not logged in
    
        return; // Exit the function early if user info is not available
    }

    const user = authState.userInfo; // Now this is safe to access
    const userId = user._id; // This should work without error now


        // Log the details to ensure they are correct
        console.log('User Info:', user);
        console.log('Personal Details:', personalDetails);
        console.log('Medical Questions:', medicalQuestions);
        console.log('Nominee Details:', nomineeDetails);
        console.log('Selected Plan:', selectedPlan);
        console.log('Calculated Premium:', calculatedPremium);

        const response = await fetch('http://localhost:5000/proposals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: userId, // Send the entire user object
                proposerDetails: personalDetails,
                medicalQuestions: medicalQuestions,
                nomineeDetails: nomineeDetails,
                selectedPlan,
                calculatedPremium
            })
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get the error response text
            console.error('Error response:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Proposal submitted successfully:', data);
        navigate('/summary', { state: { authState } });
    } catch (error) {
        console.error('Error submitting proposal:', error);
    }
};



  const progressPercentage = (step / 3) * 100;

  return (
    <div className='proposal'>
    <div className="proposal-page">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {step === 1 && (
        <div className="form-section">
          <h2>Proposer Details</h2>
          <p>Proposer is going to pay the premium and avail tax benefits</p>
          <input type="text" name="name" placeholder="Full Name as per your ID Card" onChange={handlePersonalDetailsChange} />
          <select name="gender" onChange={handlePersonalDetailsChange}>
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          <input type="text" name="pan" placeholder="PAN Card" onChange={handlePersonalDetailsChange} />
          <input type="date" name="dob" placeholder="Date of Birth" onChange={handlePersonalDetailsChange} />
          <input type="text" name="address" placeholder="Flat/House Number, Apartment" onChange={handlePersonalDetailsChange} />
          <input type="text" name="street" placeholder="Colony, Street, Sector" onChange={handlePersonalDetailsChange} />
          <input type="text" name="landmark" placeholder="Landmark" onChange={handlePersonalDetailsChange} />
          <input type="text" name="city" placeholder="City" onChange={handlePersonalDetailsChange} />
          <input type="text" name="state" placeholder="State" onChange={handlePersonalDetailsChange} />
          <input type="text" name="pincode" placeholder="Pin Code" onChange={handlePersonalDetailsChange} />
          <input type="text" name="email" placeholder="Email Address" onChange={handlePersonalDetailsChange} />
          <input type="text" name="mobile" placeholder="Mobile Number" onChange={handlePersonalDetailsChange} />
          <button className="next-btn" onClick={handleNextStep}>Proceed to Medical Questions</button>
        </div>
      )}

{step === 2 && (
  <div className="form-section">
    <h2>Medical Questions</h2>
    <p className='head1'>We’ll only ask for the details insurance companies need.</p>
    <p className='head2'>
      Has any Proposed to be Insured been diagnosed with or suffered from / is suffering from or is currently under medication for the following. If your response is yes to any of the following questions, please specify details of the same in the additional information section:
    </p>

    {/* 1. Do you smoke, consume alcohol, or chew tobacco, ghutka, paan, or use any recreational drugs? */}
    <div className="radio-group">
      <label className="radio-label">Do you smoke, consume alcohol, chew tobacco, ghutka, or paan, or use any recreational drugs?</label>
      <div className="custom-radio">
        <input
          type="radio"
          id="smokeYes"
          name="smoke"
          value="Yes"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="smokeYes">Yes</label>
      </div>
      <div className="custom-radio">
        <input
          type="radio"
          id="smokeNo"
          name="smoke"
          value="No"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="smokeNo">No</label>
      </div>
    </div>

    {/* 2. Hospitalized for any illness/injury during the last 48 months? */}
    <div className="radio-group">
      <label className="radio-label">Have any of the above mentioned person(s) to be insured been diagnosed/hospitalized for any illness/injury during the last 48 months?</label>
      <div className="custom-radio">
        <input
          type="radio"
          id="hospitalizedYes"
          name="hospitalized"
          value="Yes"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="hospitalizedYes">Yes</label>
      </div>
      <div className="custom-radio">
        <input
          type="radio"
          id="hospitalizedNo"
          name="hospitalized"
          value="No"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="hospitalizedNo">No</label>
      </div>
    </div>

    {/* 3. Filed a claim with current/previous insurer? */}
    <div className="radio-group">
      <label className="radio-label">Have any of the person(s) to be insured ever filed a claim with their current/previous insurer?</label>
      <div className="custom-radio">
        <input
          type="radio"
          id="filedClaimYes"
          name="filedClaim"
          value="Yes"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="filedClaimYes">Yes</label>
      </div>
      <div className="custom-radio">
        <input
          type="radio"
          id="filedClaimNo"
          name="filedClaim"
          value="No"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="filedClaimNo">No</label>
      </div>
    </div>

    {/* 4. Has any proposal for Health insurance been declined, cancelled, or charged a higher premium? */}
    <div className="radio-group">
      <label className="radio-label">Has any proposal for Health insurance been declined, cancelled, or charged a higher premium?</label>
      <div className="custom-radio">
        <input
          type="radio"
          id="declinedYes"
          name="declined"
          value="Yes"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="declinedYes">Yes</label>
      </div>
      <div className="custom-radio">
        <input
          type="radio"
          id="declinedNo"
          name="declined"
          value="No"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="declinedNo">No</label>
      </div>
    </div>

    {/* 5. Already covered under any other health insurance policy of Religare Health Insurance? */}
    <div className="radio-group">
      <label className="radio-label">Is any of the person(s) to be insured, already covered under any other health insurance policy of Religare Health Insurance?</label>
      <div className="custom-radio">
        <input
          type="radio"
          id="religareCoveredYes"
          name="religareCovered"
          value="Yes"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="religareCoveredYes">Yes</label>
      </div>
      <div className="custom-radio">
        <input
          type="radio"
          id="religareCoveredNo"
          name="religareCovered"
          value="No"
          onChange={handleMedicalQuestionsChange}
        />
        <label htmlFor="religareCoveredNo">No</label>
      </div>
    </div>

    <button className="prev-btn" onClick={handlePrevStep}>Back</button>
    <button className="next-btn" onClick={handleNextStep}>Continue to Nominee Section</button>
  </div>
)}



{step === 3 && (
          <div className="form-section">
            <h2>Nominee Details</h2>
            <p>Tell us who you want to make nominee. God forbid, in case of any mishap to the proposer, nominee is the person who gets the benefits.</p>
            
            <input
              type="text"
              name="nomineeFullName"
              placeholder="Nominee Full Name"
              onChange={handleNomineeDetailsChange}
              value={nomineeDetails.nomineeFullName || ''}
            />
            <input
              type="text"
              name="nomineeRelationship"
              placeholder="Relationship with Proposer"
              onChange={handleNomineeDetailsChange}
              value={nomineeDetails.nomineeRelationship || ''}
            />
            <input
              type="text"
              name="nomineeLastName"
              placeholder="Last Name (if any)"
              onChange={handleNomineeDetailsChange}
              value={nomineeDetails.nomineeLastName || ''}
            />

            <button className="prev-btn" onClick={handlePrevStep}>Back</button>
            <button className="next-btn" onClick={handleSubmit}>REVIEW & PAY</button>
          </div>
        )}
    </div>
    </div>
  );
}

export default ProposalPage;
