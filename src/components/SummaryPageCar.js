import { useLocation } from 'react-router-dom';
import './SummaryPageCar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faCogs, faCalendar, faIdBadge, faGasPump, faShieldAlt, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

const SummaryPageCar = () => {
    const location = useLocation();
    const { formData, selectedPlan } = location.state || {}; // Retrieve the state from navigation

    return (
        <div className="container">
            <h1>Summary</h1>
            
            {/* Form Data Container */}
            <div className="form-data-container">
                <h2>User Information:</h2>
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>DOB:</strong> {formData.dob}</p>
                <p><strong>Aadhaar:</strong> {formData.aadhaar}</p>
                <p><strong>Address:</strong> {formData.houseNumber}, {formData.streetName}, {formData.city}, {formData.state}, {formData.postalCode}, {formData.country}</p>
            </div>

            {/* Car Details Container */}
            <div className="car-details-container">
                <h2>Car Details:</h2>
                <p><FontAwesomeIcon icon={faCar} className="icon" /><strong>Make:</strong> {formData.carMake}</p>
                <p><FontAwesomeIcon icon={faCogs} className="icon" /><strong>Model:</strong> {formData.carModel}</p>
                <p><FontAwesomeIcon icon={faCalendar} className="icon" /><strong>Year:</strong> {formData.carYear}</p>
                <p><FontAwesomeIcon icon={faIdBadge} className="icon" /><strong>License Plate:</strong> {formData.carLicensePlate}</p>
                <p><FontAwesomeIcon icon={faGasPump} className="icon" /><strong>Fuel Type:</strong> {formData.fuelType}</p>
                <p><FontAwesomeIcon icon={faShieldAlt} className="icon" /><strong>Coverage Type:</strong> {formData.coverageType}</p>
                <p><FontAwesomeIcon icon={faRupeeSign} className="icon" /><strong>IDV:</strong> Rs. {formData.idv}</p>
                
                <h4>Add-Ons:</h4>
                <ul>
                    {formData.addOns.map((addOn, index) => (
                        <li key={index}>{addOn}</li>
                    ))}
                </ul>
            </div>

            {/* Selected Plan Details */}
            {selectedPlan ? (
                <div className="selected-plan-container">
                    <h3>Selected Plan: {selectedPlan.name}</h3>
                    <p><strong>Type:</strong> {selectedPlan.type}</p>
                    <p><strong>Amount:</strong> Rs. {selectedPlan.amount}</p>
                    
                    <h4>Features:</h4>
                    <ul>
                        {selectedPlan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    
                    <h4>Claim Benefits:</h4>
                    <ul>
                        {selectedPlan.claimBenefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No selected plan available</p>
            )}

            {/* Payment Details Container */}
            <div className="payment-details-container">
                <h3>Plan Summary</h3>
                <div className="plan-details">
                    <p><strong>Plan Type:</strong> {selectedPlan.type}</p>
                    <p><strong>IDV Cover:</strong> {formData.idv}</p>
                    <p><strong>Premium Amount:</strong> ₹{selectedPlan.amount}</p>
                    <p><strong>GST @18%:</strong> ₹{(selectedPlan.amount * 0.18).toFixed(2)}</p>
                </div>
                <div className="total-payment">
                    <h4>Total: ₹{(selectedPlan.amount + selectedPlan.amount * 0.18).toFixed(2)}</h4>
                    <button className="pay-button">PAY SECURELY</button>
            
                </div>
            </div>
        </div>
    );
};

export default SummaryPageCar;
