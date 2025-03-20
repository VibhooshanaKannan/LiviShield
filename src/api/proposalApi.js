// src/api/proposalApi.js
import axios from 'axios';

export const fetchProposals = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/proposals/${userId}`);
    return response.data; // Assuming the response contains an array of proposals
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error; // You can handle errors more gracefully in a real app
  }
};

export const fetchCarProposals = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/car-proposals/${userId}`);
    return response.data; // Assuming the response contains an array of car proposals
  } catch (error) {
    console.error("Error fetching car proposals:", error);
    throw error; // You can handle errors more gracefully in a real app
  }
};
