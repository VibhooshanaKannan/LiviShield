import React from 'react';
import './ViewPlans.css';

function ViewPlans() {
  const plans = [
    {
      id: 1,
      logo: 'https://example.com/logo1.png', // Replace with actual image URL
      name: 'NCB Super Premium',
      coverAmount: '₹7 Lakh',
      cashlessHospitals: 219,
      monthlyCost: '₹800/month',
      annualCost: '₹9,595 annually',
      features: [
        'Day 1 coverage for maternity & hospital discount up to ₹25,000 during childbirth',
        'Single pvt AC Room',
        '₹4.20 lakh No Claim Bonus',
        'Restoration of cover once a year',
      ],
    },
    {
      id: 2,
      logo: 'https://example.com/logo2.png', // Replace with actual image URL
      name: 'Aspire Gold+ (Direct)',
      coverAmount: '₹5 Lakh',
      cashlessHospitals: 270,
      monthlyCost: '₹684/month',
      annualCost: '₹8,201 annually',
      features: [
        'Inclusive of 5% direct discount',
        'Get maternity coverage for both mother & newborn baby',
        'No Room Rent Limit',
        '₹5 lakh No Claim Bonus',
        'Unlimited Restoration of Cover, Forever',
      ],
    },
  ];

  return (
    <div className="insurance-plans">
      <div className="filter-bar">
        <button>Cover</button>
        <button>Sort by</button>
        <button>No room rent limit</button>
        <button>Doctor Consultation and Pharmacy</button>
      </div>

      <div className="plan-list">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-item">
            <div className="plan-logo">
              <img src={plan.logo} alt="logo" />
            </div>
            <div className="plan-details">
              <h2>{plan.name}</h2>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="plan-info">
                <span>Cover amount: {plan.coverAmount}</span>
                <span>Cashless hospitals: {plan.cashlessHospitals}</span>
              </div>
              <div className="plan-pricing">
                <span>{plan.monthlyCost}</span>
                <small>{plan.annualCost}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewPlans;
