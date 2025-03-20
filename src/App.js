import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import HomePage2 from './components/HomePage2';
import HomePage from './components/HomePage';
import ViewPlans from './components/ViewPlans';
import Navbar2 from './components/navbar2';
import HealthInsurance from './components/HealthInsurance';
import FamilyHealthInsurance from './components/FamilyHealthInsurancePage';
import ProposalFormPage from './components/ProposalPage';
import SummaryPage from './components/SummaryPage';
import CarInsurance from './components/CarInsurance';
//import CarSummaryPage from './components/CarSummaryPage';
import CarSummary from './components/CarSummaryPage';
import { AuthProvider } from './components/AuthContext';
import CarProposal from './components/ProposalForm';
//import CarSummary from './components/SummaryPageCar';
import HealthRenewal from './components/HealthInsuranceRenewal';
import UserProfile from './components/UserProposals';
import Payment from './components/PaymentPage';
import Compare from './components/Comparison'

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<HomePage2 />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/viewplans" element={<ViewPlans />} /> 
        <Route path="/health-insurance" element={<HealthInsurance />} />
        <Route path="/family-health-insurance" element={<FamilyHealthInsurance />} />
        <Route path="/proposal" element={<ProposalFormPage />} />
        <Route path="/summary" element={<SummaryPage />} /> 
        <Route path="/carsummary" element={<CarSummary />} /> 
        <Route path="/car-insurance" element={<CarInsurance />} />
        <Route path="/carproposal" element={<CarProposal />} />
        <Route path="/healthrenewal" element={<HealthRenewal />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/payment" element={<Payment />} />
        <Route path='/comparison' element={<Compare />} />
       
      </Routes>
    </Router>
    </AuthProvider>
    
  );
}

export default App;
