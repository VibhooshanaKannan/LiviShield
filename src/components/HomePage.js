// HomePage.js
import React from 'react';
import Navbar from './navbar';
import Banner from './Banner';
import InsuranceProducts from './InsuranceProducts';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <InsuranceProducts />
    </div>
  );
}

export default HomePage;
