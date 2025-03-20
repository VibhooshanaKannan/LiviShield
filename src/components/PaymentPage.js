import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, selectedPlan, calculatedPremium, proposalId } = location.state || {};



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activePaymentMethod, setActivePaymentMethod] = useState('card');
  const [priceBreakdown, setPriceBreakdown] = useState({
    basePremium: 0,
    gst: 0,
    stampDuty: 0,
    totalAmount: 0
  });

  const [paymentDetails, setPaymentDetails] = useState({
    // Card Details
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    cardType: 'credit', // credit or debit

    // UPI Details
    upiId: '',

    // Net Banking Details
    bankName: '',
    accountNumber: '',

    // Wallet Details
    walletProvider: '',
    walletNumber: ''
  });

  const [errors, setErrors] = useState({});


  

  useEffect(() => {
    // Calculate price breakdown
    const basePremium = parseFloat(calculatedPremium) || 0;
    const gstRate = 0.18;
    const stampDutyRate = 0.01;

    const gstAmount = basePremium * gstRate;
    const stampDutyAmount = basePremium * stampDutyRate;
    const totalAmount = basePremium + gstAmount + stampDutyAmount;

    setPriceBreakdown({
      basePremium: basePremium.toFixed(2),
      gst: gstAmount.toFixed(2),
      stampDuty: stampDutyAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });
  }, [calculatedPremium]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
      if (formattedValue.length > 19) return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    }

    // Limit CVV to 3 digits
    if (name === 'cvv' && value.length > 3) return;

    setPaymentDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    switch (activePaymentMethod) {
      case 'card':
        if (!paymentDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
          newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        if (!paymentDetails.cardHolderName.trim()) {
          newErrors.cardHolderName = 'Card holder name is required';
        }
        if (!paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
          newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }
        if (!paymentDetails.cvv.match(/^\d{3}$/)) {
          newErrors.cvv = 'Please enter a valid 3-digit CVV';
        }
        break;

      case 'upi':
        if (!paymentDetails.upiId.match(/^[\w.-]+@[\w.-]+$/)) {
          newErrors.upiId = 'Please enter a valid UPI ID';
        }
        break;

      case 'netbanking':
        if (!paymentDetails.bankName) {
          newErrors.bankName = 'Please select a bank';
        }
        break;

      case 'wallet':
        if (!paymentDetails.walletProvider) {
          newErrors.walletProvider = 'Please select a wallet provider';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      // First simulate the payment processing
      console.log('Processing payment for amount:', priceBreakdown.totalAmount);
      console.log('Payment method:', activePaymentMethod);
      console.log('Payment details:', paymentDetails);
  
      // Simulate payment gateway response
      const paymentResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Payment processed successfully' });
        }, 1500);
      });
  
      if (paymentResponse.success) {

        console.log('Updating proposal with ID:', proposalId);

        // After successful payment, update the proposal status
        const response = await fetch(`http://localhost:5000/proposals/${proposalId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update proposal status');
        }
  
        // If everything is successful, show success message and redirect
        alert('Payment successful!');
        navigate('/userprofile', { state: { authState } });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message || 'Payment processing failed. Please try again.');
      alert(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center mb-0">Payment Details</h3>
            </div>
            <div className="card-body">
              {/* Price Breakdown Section */}
              <div className="mb-4 p-3 bg-light rounded">
                <h5 className="text-primary mb-3">Price Breakdown</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Base Premium:</span>
                  <span>₹{priceBreakdown.basePremium}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>GST (18%):</span>
                  <span>₹{priceBreakdown.gst}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Stamp Duty (1%):</span>
                  <span>₹{priceBreakdown.stampDuty}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{priceBreakdown.totalAmount}</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <ul className="nav nav-pills mb-4 justify-content-center" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activePaymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setActivePaymentMethod('card')}
                  >
                    Card Payment
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activePaymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setActivePaymentMethod('upi')}
                  >
                    UPI
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activePaymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setActivePaymentMethod('netbanking')}
                  >
                    Net Banking
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activePaymentMethod === 'wallet' ? 'active' : ''}`}
                    onClick={() => setActivePaymentMethod('wallet')}
                  >
                    Wallet
                  </button>
                </li>
              </ul>

              {/* Payment Forms */}
              <form onSubmit={handleSubmit}>
                {/* Card Payment Form */}
                {activePaymentMethod === 'card' && (
                  <div>
                    <div className="mb-3">
                      <div className="btn-group w-100 mb-3">
                        <button
                          type="button"
                          className={`btn ${paymentDetails.cardType === 'credit' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setPaymentDetails(prev => ({ ...prev, cardType: 'credit' }))}
                        >
                          Credit Card
                        </button>
                        <button
                          type="button"
                          className={`btn ${paymentDetails.cardType === 'debit' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setPaymentDetails(prev => ({ ...prev, cardType: 'debit' }))}
                        >
                          Debit Card
                        </button>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="cardNumber" className="form-label">Card Number</label>
                        <input
                          type="text"
                          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNumber}
                          onChange={handleInputChange}
                        />
                        {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="cardHolderName" className="form-label">Card Holder Name</label>
                        <input
                          type="text"
                          className={`form-control ${errors.cardHolderName ? 'is-invalid' : ''}`}
                          id="cardHolderName"
                          name="cardHolderName"
                          placeholder="John Doe"
                          value={paymentDetails.cardHolderName}
                          onChange={handleInputChange}
                        />
                        {errors.cardHolderName && <div className="invalid-feedback">{errors.cardHolderName}</div>}
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                          <input
                            type="text"
                            className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentDetails.expiryDate}
                            onChange={handleInputChange}
                          />
                          {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="cvv" className="form-label">CVV</label>
                          <input
                            type="password"
                            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={paymentDetails.cvv}
                            onChange={handleInputChange}
                          />
                          {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {activePaymentMethod === 'upi' && (
                  <div className="mb-3">
                    <label htmlFor="upiId" className="form-label">UPI ID</label>
                    <input
                      type="text"
                      className={`form-control ${errors.upiId ? 'is-invalid' : ''}`}
                      id="upiId"
                      name="upiId"
                      placeholder="yourname@upi"
                      value={paymentDetails.upiId}
                      onChange={handleInputChange}
                    />
                    {errors.upiId && <div className="invalid-feedback">{errors.upiId}</div>}
                  </div>
                )}

                {/* Net Banking Form */}
                {activePaymentMethod === 'netbanking' && (
                  <div className="mb-3">
                    <label htmlFor="bankName" className="form-label">Select Bank</label>
                    <select
                      className={`form-select ${errors.bankName ? 'is-invalid' : ''}`}
                      id="bankName"
                      name="bankName"
                      value={paymentDetails.bankName}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose a bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                    {errors.bankName && <div className="invalid-feedback">{errors.bankName}</div>}
                  </div>
                )}

                {/* Wallet Form */}
                {activePaymentMethod === 'wallet' && (
                  <div className="mb-3">
                    <label htmlFor="walletProvider" className="form-label">Select Wallet</label>
                    <select
                      className={`form-select ${errors.walletProvider ? 'is-invalid' : ''}`}
                      id="walletProvider"
                      name="walletProvider"
                      value={paymentDetails.walletProvider}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose a wallet provider</option>
                      <option value="paytm">Paytm</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="amazonpay">Amazon Pay</option>
                      <option value="mobikwik">MobiKwik</option>
                    </select>
                    {errors.walletProvider && <div className="invalid-feedback">{errors.walletProvider}</div>}
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary btn-lg" onClick={handleSubmit}>
            Pay ₹{priceBreakdown.totalAmount}
        </button>
                  <p className="text-muted text-center small mt-2">
                    <i className="bi bi-lock"></i> Your payment information is secure and encrypted
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;