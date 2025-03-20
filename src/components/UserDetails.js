import React from 'react';
import { useAuth } from './AuthContext';

const UserDetails = () => {
  const { authState } = useAuth();

  if (!authState) {
    return <div>Please log in to see your details.</div>;
  }

  const { token, userInfo } = authState; // Assuming userInfo contains user details
  return (
    <div>
      <h3>User Details</h3>
      <p><strong>Name:</strong> {userInfo.name}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      {/* Display more user details as needed */}
    </div>
  );
};

export default UserDetails;
