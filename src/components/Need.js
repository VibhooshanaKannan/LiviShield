import React from 'react';
import './Need.css'; // Ensure this file exists for styling
import accidentImage from '../assets/Need.png'; // Ensure your image path is correct

const Need = () => {
  const sections = [
    {
      title: 'Protection Against Accidental Damages',
      description: 'Plans like Safe Voyage and Ultimate Shield provide comprehensive coverage for accident-related damage to your vehicle. Accidents can be costly, and insurance can help cover repair costs, ensuring you\'re not burdened by massive bills.',
    },
    {
      title: 'Coverage for Third-Party Liabilities',
      description: 'Even if you\'re the safest driver, accidents involving others can happen. With plans such as the Essential Liability Plan and Basic Protection Plan, your insurance covers damages to third-party property and injuries, protecting you from legal and financial liability.',
    },
    {
      title: 'Safeguard Against Theft and Vandalism',
      description: 'Vehicles are valuable assets, and theft or vandalism can result in significant financial loss. Insurance plans like Evergreen Protection provide coverage for theft and malicious damage, offering peace of mind knowing your car is protected.',
    },
    {
      title: 'No Claim Bonus Benefits',
      description: 'Many policies, like Safe Voyage, offer a no-claim bonus, rewarding drivers with discounts on their premiums if no claims are made. This can lead to substantial savings over time while maintaining robust protection.',
    },
    {
      title: 'Cashless Repairs and Hassle-Free Claims',
      description: 'Insurance plans such as the Ultimate Shield and Third-Party Shield Plan offer cashless repair services at network garages, simplifying the process of getting your vehicle back on the road. They also ensure that claims are processed quickly, giving you one less thing to worry about.',
    },
    {
      title: 'Personal Injury Protection',
      description: 'Your safety matters. Comprehensive policies like Ultimate Shield not only cover vehicle damage but also provide personal injury coverage for the driver and passengers. In the unfortunate event of an accident, these plans cover medical expenses related to injuries.',
    },
    {
      title: '24/7 Emergency Assistance',
      description: 'Breakdown on the road? Insurance plans like Smart Coverage Plan and Secure Drive Plan offer round-the-clock roadside assistance, ensuring you’re never stranded in an emergency situation.',
    },
    {
      title: 'Financial Security in Crisis',
      description: 'Accidents and damages can result in hefty financial burdens. By investing in a comprehensive insurance plan like Secure Drive Plan, you’re safeguarding your savings and ensuring you won’t be left dealing with significant out-of-pocket expenses.',
    },
  ];

  return (
    <div className="need-container">
      <div className="need-intro">
        <img src={accidentImage} alt="Car Accident" className="intro-image" />
        <div className="intro-text">
          <h2>Why Do You Need Car Insurance?</h2>
          <p>
            Car insurance is more than just a legal requirement; it’s a critical shield that protects both you and your vehicle from financial losses in the event of accidents, theft, or damage. Whether you're navigating daily commutes or embarking on long road trips, having the right insurance ensures you're prepared for the unexpected.
          </p>
        </div>
      </div>

      <div className="need-grid">
        {sections.map((section, index) => (
          <div className="need-section" key={index}>
            <h4>{section.title}</h4>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Need;
