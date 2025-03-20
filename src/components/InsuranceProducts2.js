// src/components/InsuranceProducts.js
import React from 'react';
import './InsuranceProducts.css'; // Add this file for custom styles
import termIcon from '../assets/term.png';
import healthIcon from '../assets/healthcare.png';
import carIcon from '../assets/car.png';
import bikeIcon from '../assets/2wheeler.png';



const products = [
  { name: "Term Life Insurance", icon: termIcon, discount: "Upto 10% Discount" },
  { name: "Health Insurance", icon: healthIcon, discount: "Cashless Anywhere" },
  //{ name: "Investment Plans", icon: "icon-path", discount: "In-Built Life Cover" },
  { name: "Car Insurance", icon: carIcon, discount: "Upto 85% Discount" },
  { name: "2 Wheeler Insurance", icon: bikeIcon, discount: "" },
 // { name: "Family Health Insurance", icon: "icon-path", discount: "Upto 25% Discount" },
  //{ name: "Travel Insurance", icon: "icon-path", discount: "" },
  //{ name: "Term Insurance (Women)", icon: "icon-path", discount: "Upto 20% Cheaper" },
 // { name: "Free of Cost Term Plan", icon: "icon-path", discount: "" },
  //{ name: "Guaranteed Return Plans", icon: "icon-path", discount: "" },
 // { name: "Child Savings Plans", icon: "icon-path", discount: "Premium Waiver" },
  //{ name: "Retirement Plans", icon: "icon-path", discount: "" },
  //{ name: "Employee Group Health Insurance", icon: "icon-path", discount: "Upto 65% Discount" },
 // { name: "Home Insurance", icon: "icon-path", discount: "Upto 25% Discount" }
];

function InsuranceProducts() {
  return (
    <div className="products-container">
      {products.map((product, index) => (
        <div key={index} className="product-card">
          <img src={product.icon} alt={product.name} />
          <p>{product.discount}</p>
          <h5>{product.name}</h5>
        </div>
      ))}
    </div>
  );
}

export default InsuranceProducts;
