import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col, InputGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios'; // Import Axios for API calls
import './HealthInsuranceRenewal.css'; // Import custom styles for professional design

const HealthInsuranceRenewal = () => {
  const [formData, setFormData] = useState({
    policyNumber: '',
    fullName: '',
    email: '',
    phone: '',
    renewalDate: '',
    paymentOption: 'Credit Card',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.policyNumber || !formData.fullName || !formData.email || !formData.phone || !formData.renewalDate) {
      setError('Please fill out all required fields');
      setLoading(false);
      return;
    }

    setError('');

    try {
      // API call to submit renewal request
      const response = await axios.post('http://localhost:5000/api/renewal', formData);
      if (response.status === 200) {
        setSubmitted(true);
      }
    } catch (err) {
      setError('Error submitting renewal request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      The unique number associated with your health insurance policy.
    </Tooltip>
  );

  return (
    <div className="renewal-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="renewal-card shadow-lg">
            <Card.Title className="text-center mb-4 renewal-title">
              Health Insurance Renewal
            </Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            {submitted && <Alert variant="success">Your renewal request has been submitted successfully!</Alert>}
            <Form onSubmit={handleSubmit}>
              {/* Policy Number with Tooltip */}
              <Form.Group controlId="policyNumber">
                <OverlayTrigger placement="right" overlay={renderTooltip}>
                  <Form.Label className="form-label">Policy Number <i className="bi bi-info-circle"></i></Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  placeholder="Enter your policy number"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  className="form-control-lg rounded-pill"
                />
              </Form.Group>

              {/* Full Name */}
              <Form.Group controlId="fullName" className="mt-3">
                <Form.Label className="form-label">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-control-lg rounded-pill"
                />
              </Form.Group>

              {/* Email */}
              <Form.Group controlId="email" className="mt-3">
                <Form.Label className="form-label">Email address</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="input-group-text">@</InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control-lg rounded-pill"
                  />
                </InputGroup>
              </Form.Group>

              {/* Phone Number */}
              <Form.Group controlId="phone" className="mt-3">
                <Form.Label className="form-label">Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control-lg rounded-pill"
                />
              </Form.Group>

              {/* Renewal Date */}
              <Form.Group controlId="renewalDate" className="mt-3">
                <Form.Label className="form-label">Renewal Date</Form.Label>
                <Form.Control
                  type="date"
                  name="renewalDate"
                  value={formData.renewalDate}
                  onChange={handleChange}
                  className="form-control-lg rounded-pill"
                />
              </Form.Group>

              {/* Payment Option */}
              <Form.Group controlId="paymentOption" className="mt-3">
                <Form.Label className="form-label">Payment Option</Form.Label>
                <Form.Select
                  name="paymentOption"
                  value={formData.paymentOption}
                  onChange={handleChange}
                  className="form-control-lg rounded-pill"
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Net Banking</option>
                  <option>UPI</option>
                </Form.Select>
              </Form.Group>

              {/* Submit Button */}
              <Button className="mt-4 w-100 btn-lg btn-submit" variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  'Pay for Renewal'
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HealthInsuranceRenewal;
