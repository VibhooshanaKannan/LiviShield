import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthInsurance.css';
import { FaHeartbeat, FaUserShield, FaProcedures, FaBaby, FaExchangeAlt, FaSyringe } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import HealthInsuranceCalculator from './HealthInsuranceCalc';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

import johnImage from '../assets/user1.jpg';
import janeImage from '../assets/user2.jpg';
import michaelImage from '../assets/user3.jpg';

function HealthInsurance() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLearnMoreClick = (planType) => {
    switch (planType) {
      case 'Family Health Insurance':
        navigate('/family-health-insurance');
        break;
      case 'critical':
        navigate('/critical-illness-insurance');
        break;
      case 'individual':
        navigate('/individual-health-insurance');
        break;
      // Add more cases for other plan types
      default:
        navigate('/health-insurance'); // Default page if no match
        break;
    }
  };
  

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/plans');
        setPlans(response.data);
        setFilteredPlans(response.data);
      } catch (error) {
        console.error('Error fetching health insurance plans:', error);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    // Filter plans based on search query
    const filtered = plans.filter(plan =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [searchQuery, plans]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    // Trigger search filter, this is now handled by the useEffect
  };

  const testimonials = [
    {
      name: "John Doe",
      feedback: "This health insurance plan has been a lifesaver. The coverage is excellent, and the customer service is top-notch.",
      image: johnImage
    },
    {
      name: "Jane Smith",
      feedback: "I switched to this company and I couldn’t be happier. The transition was smooth, and the benefits are fantastic!",
      image: janeImage
    },
    {
      name: "Michael Johnson",
      feedback: "Highly recommend! The plans are affordable, and the coverage is extensive. Great peace of mind.",
      image: michaelImage
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  const toggleCalculator = () => {
    setIsCalculatorOpen(!isCalculatorOpen);
  };

  return (
    <div className="health-insurance-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Protect Your Health, Secure Your Future</h1>
          <p>Find the perfect health insurance plan tailored to your needs.</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a health insurance plan..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="button" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </header>

      <div className="insurance-cards">
        {filteredPlans.map(plan => (
          <div className="card" key={plan._id}>
            <i className={`card-icon ${plan.icon}`}></i> {/* Use dynamic icons if stored in the database */}
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <button
              className="button-86"
              role="button"
              onClick={() => handleLearnMoreClick(plan.name)} // Pass plan name to the function
            >
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* Customer Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial">
              <div className="testimonial-image">
                <img src={testimonial.image} alt={testimonial.name} />
              </div>
              <p>"{testimonial.feedback}"</p>
              <h3>- {testimonial.name}</h3>
            </div>
          ))}
        </Slider>
      </section>
      {/* End of Customer Testimonials Section */}

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>What is covered under the Family Health Insurance plan?</Accordion.Header>
            <Accordion.Body>
              The Family Health Insurance plan covers hospitalization, doctor visits, prescription drugs, and preventive care for all family members under one policy.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Can I switch to a different health insurance plan?</Accordion.Header>
            <Accordion.Body>
              Yes, you can switch to a different plan. Health Insurance Portability allows you to change providers without losing your accumulated benefits.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Are maternity-related expenses covered?</Accordion.Header>
            <Accordion.Body>
              Yes, our Maternity Insurance plan covers maternity-related expenses, including prenatal care, delivery, and postnatal care for both mother and newborn.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </section>
      {/* End of FAQ Section */}
      
      {/* Floating Sidebar for Health Insurance Calculator */}
      {isCalculatorOpen && (
        <div className="sidebar">
          <HealthInsuranceCalculator />
        </div>
      )}

      {/* Sticky Footer for Show Calculator Button */}
      <div className="sticky-footer">
        <p>Calculate your insurance coverage with our insurance calculator</p>
        <button className="button-87" role="button" onClick={toggleCalculator}>
          {isCalculatorOpen ? 'Hide Calculator' : 'Show Calculator'}
        </button>
      </div>
    </div>
  );
}

export default HealthInsurance;
