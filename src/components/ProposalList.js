import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ProposalList = () => {
  const { authState } = useAuth();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!authState) return;

      const response = await fetch(`/api/proposals?userId=${authState.userInfo._id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`, // Use token for authorization
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProposals(data);
      }
    };

    fetchProposals();
  }, [authState]);

  return (
    <div>
      <h3>Your Proposals</h3>
      {proposals.length > 0 ? (
        proposals.map((proposal) => (
          <div key={proposal._id}>
            <p><strong>Selected Plan:</strong> {proposal.selectedPlan.name}</p>
            <p><strong>Calculated Premium:</strong> {proposal.calculatedPremium}</p>
            {/* Display more proposal details as needed */}
          </div>
        ))
      ) : (
        <p>No proposals found.</p>
      )}
    </div>
  );
};

export default ProposalList;
