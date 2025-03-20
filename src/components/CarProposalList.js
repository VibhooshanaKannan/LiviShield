import React, { useEffect, useState } from 'react'; // Importing useEffect and useState
import { useAuth } from './AuthContext';
; // Adjust the path based on your project structure

const CarProposalList = () => {
  const { authState } = useAuth();
  const [carProposals, setCarProposals] = useState([]);

  useEffect(() => {
    const fetchCarProposals = async () => {
      if (!authState) return;

      const response = await fetch(`/api/carProposals?userId=${authState.userInfo._id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`, // Use token for authorization
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCarProposals(data);
      } else {
        console.error('Failed to fetch car proposals:', response.statusText);
      }
    };

    fetchCarProposals();
  }, [authState]);

  return (
    <div>
      <h3>Your Car Proposals</h3>
      {carProposals.length > 0 ? (
        carProposals.map((carProposal) => (
          <div key={carProposal._id}>
            <p><strong>Car Make:</strong> {carProposal.carMake}</p>
            <p><strong>Car Model:</strong> {carProposal.carModel}</p>
            <p><strong>IDV:</strong> {carProposal.idv}</p>
            {/* Display more car proposal details as needed */}
          </div>
        ))
      ) : (
        <p>No car proposals found.</p>
      )}
    </div>
  );
};

export default CarProposalList;
