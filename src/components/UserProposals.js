import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Car, User, MapPin, Phone, Mail, Shield } from 'lucide-react';
import './UserProposals.css';

const UserProposals = () => {
  const [healthProposals, setHealthProposals] = useState([]);
  const [carProposals, setCarProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('health');
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, selectedPlan } = location.state || {};

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (!authState?.userInfo) {
          console.error('Auth state or userInfo is missing');
          navigate('/signin');
          return;
        }

        const userId = authState.userInfo._id;
        const fullName = authState.userInfo.name;

        const healthResponse = await fetch(`http://localhost:5000/proposals/user/${userId}`);
        if (!healthResponse.ok) throw new Error('Network response was not ok for health proposals');
        const healthData = await healthResponse.json();
        setHealthProposals(healthData);

        const carResponse = await fetch(`http://localhost:5000/car-proposals/${encodeURIComponent(fullName)}`);
        if (!carResponse.ok) throw new Error('Network response was not ok for car proposals');
        const carData = await carResponse.json();
        setCarProposals(carData);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, [authState, navigate]);

  const filteredHealthProposals = selectedPlan
    ? healthProposals.filter(proposal => proposal.planDetails.name === selectedPlan.name)
    : healthProposals;

  const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
      switch (status?.toLowerCase()) {
        case 'approved': return 'approved';
        case 'pending': return 'pending';
        case 'rejected': return 'rejected';
        default: return 'default';
      }
    };

    return (
      <span className={`status-badge ${getStatusClass(status)}`}>
        {status || 'Pending'}
      </span>
    );
  };

  const ProposalCard = ({ proposal, type }) => {
    const isHealth = type === 'health';

    return (
      <div className="proposal-card">
        <div className="card-header">
          <div className="header-content">
            <h3 className="card-title">
              {isHealth ? 'Health Insurance Proposal' : 'Car Insurance Proposal'}
            </h3>
            <StatusBadge status={proposal.status} />
          </div>
        </div>

        <div className="card-content">
          <div className="section">
            <h4 className="section-title">
              <User className="w-5 h-5" />
              Proposer Details
            </h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span>{isHealth ? proposal.proposerDetails.name : proposal.fullName}</span>
              </div>
              <div className="detail-item">
                <Phone className="w-4 h-4" />
                <span className="detail-label">Contact:</span>
                <span>{isHealth ? proposal.proposerDetails.mobile : proposal.phone}</span>
              </div>
              <div className="detail-item">
                <Mail className="w-4 h-4" />
                <span className="detail-label">Email:</span>
                <span>{isHealth ? proposal.proposerDetails.email : proposal.email}</span>
              </div>
              <div className="detail-item">
                <Calendar className="w-4 h-4" />
                <span className="detail-label">DOB:</span>
                <span>
                  {new Date(isHealth ? proposal.proposerDetails.dob : proposal.dob).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="section">
            <h4 className="section-title">
              <Shield className="w-5 h-5" />
              Coverage Details
            </h4>
            {isHealth ? (
              <div className="coverage-section">
                <p className="detail-item">Plan: {proposal.planDetails.name}</p>
                <p className="detail-item">Premium: ₹{proposal.calculatedPremium}</p>
                <div className="coverage-list">
                  {Object.entries(proposal.planDetails.coverage)
                    .filter(([, value]) => value)
                    .map(([key]) => (
                      <div key={key} className="coverage-item">
                        <span className="coverage-dot"></span>
                        <span>{key.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="coverage-section">
                <p className="detail-item">IDV: ₹{proposal.idv}</p>
                <p className="detail-item">Coverage Type: {proposal.coverageType}</p>
                <div className="coverage-list">
                  {proposal.addOns.map(addOn => (
                    <div key={addOn} className="coverage-item">
                      <span className="coverage-dot"></span>
                      <span>{addOn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(isHealth ? '/health-proposal-detail' : '/car-proposal-detail', {
              state: { proposal }
            })}
            className="action-button"
          >
            Continue with this Proposal
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="proposals-container">


        {/* User Details Section */}
        {authState?.userInfo && (
          <div className="user-details">
            <h2>Welcome, {authState.userInfo.name}!</h2>
            
          </div>
        )}
      <div className="proposals-wrapper">
        <h1 className="page-title">Your Proposals</h1>

        

        <div className="tabs-container">
          <button
            onClick={() => setActiveTab('health')}
            className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
          >
            Health Insurance
          </button>
          <button
            onClick={() => setActiveTab('car')}
            className={`tab-button ${activeTab === 'car' ? 'active' : ''}`}
          >
            Car Insurance
          </button>
        </div>

        <div className="proposals-content">
          {activeTab === 'health' ? (
            filteredHealthProposals.length > 0 ? (
              filteredHealthProposals.map(proposal => (
                <ProposalCard key={proposal._id} proposal={proposal} type="health" />
              ))
            ) : (
              <p className="empty-message">No health proposals found.</p>
            )
          ) : carProposals.length > 0 ? (
            carProposals.map(proposal => (
              <ProposalCard key={proposal._id} proposal={proposal} type="car" />
            ))
          ) : (
            <p className="empty-message">No car proposals found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProposals;
