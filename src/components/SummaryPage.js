import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SummaryPage.css'; // Add your custom CSS here
import 'bootstrap/dist/css/bootstrap.min.css';

function SummaryPage() {
  const [proposals, setProposals] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, selectedPlan, calculatedPremium } = location.state || {}; // Extract authState and selectedPlan from location.state

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // Ensure authState and userInfo are available
        if (!authState || !authState.userInfo) {
          console.error('Auth state or userInfo is missing');
          navigate('/signin'); // Redirect to signin if authState is not defined
          return;
        }

        const userId = authState.userInfo._id; // Safely access _id from userInfo
        console.log('User ID:', userId); // Check if userId is properly retrieved

        const response = await fetch(`http://localhost:5000/proposals/user/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProposals(data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, [authState, navigate]); // Add authState and navigate as dependencies

  // Filter proposals based on the selected plan
  const filteredProposals = selectedPlan
    ? proposals.filter(proposal => proposal.planDetails.name === selectedPlan.name)
    : proposals;

    const handleProceed = () => {
      // Get the calculatedPremium from the first filtered proposal
      const currentProposal = filteredProposals[0];
      const calculatedPremium = currentProposal ? currentProposal.calculatedPremium : 0;
      const proposalId = currentProposal._id;
      
      navigate('/payment', { 
        state: { 
          authState, 
          selectedPlan,
          calculatedPremium, // Pass the calculatedPremium in the navigation state
          proposalId
        } 
      });
    };
  return (
    <div className='summary-page'>
      <h2>Your Proposal</h2>
      {filteredProposals.length > 0 ? (
        <div className='cards-container'>
          {filteredProposals.map(proposal => (
            <div key={proposal._id} className='proposal-card'>
              {/* Proposer Details */}
              <div className='card'>
                <h2>Proposer Details</h2>
                <p><strong>Name:</strong> {proposal.proposerDetails.name}</p>
                <p><strong>Gender:</strong> {proposal.proposerDetails.gender}</p>
                <p><strong>Date of Birth:</strong> {new Date(proposal.proposerDetails.dob).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {proposal.proposerDetails.address}, {proposal.proposerDetails.street}, {proposal.proposerDetails.landmark}</p>
                <p><strong>City:</strong> {proposal.proposerDetails.city}</p>
                <p><strong>State:</strong> {proposal.proposerDetails.state}</p>
                <p><strong>Pincode:</strong> {proposal.proposerDetails.pincode}</p>
                <p><strong>Email:</strong> {proposal.proposerDetails.email}</p>
                <p><strong>Mobile:</strong> {proposal.proposerDetails.mobile}</p>
              </div>

              {/* Nominee Details */}
              <div className='card'>
                <h2>Nominee Details</h2>
                <p><strong>Nominee Name:</strong> {proposal.nomineeDetails?.nomineeFullName || 'N/A'}</p>
                {/* Add other nominee details if available */}
              </div>

              {/* Plan Details */}
              <div className='card'>
                <h2>Plan Details</h2>
                <p><strong>Plan Name:</strong> {proposal.planDetails.name}</p>
                <p><strong>Calculated Premium:</strong> {proposal.calculatedPremium}</p>
                <p><strong>Status:</strong> {proposal.status || 'Pending'}</p>


                {/* Coverage Details */}
                <h3>Coverage Details</h3>
  <ul>
    {Object.entries(proposal.planDetails.coverage)
      .filter(([, value]) => value) // Filter to show only items where value is true
      .map(([key, value]) => (
        <li key={key}>
          <strong>{key.replace(/_/g, ' ')}</strong>
        </li>
      ))}
  </ul>




  <h3>Additional Features</h3>
  <ul>
    {Object.entries(proposal.planDetails.additional_features)
      .filter(([, value]) => value) // Filter to show only items where value is true
      .map(([key, value]) => (
        <li key={key}>
          <strong>{key.replace(/_/g, ' ')}</strong>
        </li>
      ))}
  </ul>






              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No proposals found.</p>
      )}

<div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleProceed}>
            Pay
          </button>
        </div>
    </div>
  );
}

export default SummaryPage;
