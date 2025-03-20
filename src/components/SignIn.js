import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
//import { useNavigate } from 'react-router-dom';
//import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import Modal from './Modal';

import SuccessAlert from './SuccessAlert';

//import AuthContext from './AuthContext';

const apiUrl = 'http://localhost:5000'; // Update with your backend URL

const countryCodes = [
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+91', name: 'India' },
  { code: '+81', name: 'Japan' },
  // Add more country codes as needed
];



function SignIn() {
  const [authType, setAuthType] = useState('mobile');
  const [countryCode, setCountryCode] = useState('+1');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [signUp, setSignUp] = useState(false); // New state for signup
  const [name, setName] = useState(''); // New state for user name
  const [password, setPassword] = useState(''); // New state for password
  const [passwordValidMessage, setPasswordValidMessage] = useState(''); 

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
   // Password validation states
   const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    numeric: false,
    special: false
  });


  // Add a new state variable to track sign-in status
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate


  const { login } = useAuth();

  



  const validatePassword = (password) => {
    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const numericValid = /[0-9]/.test(password);
    const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValid({
      length: lengthValid,
      uppercase: uppercaseValid,
      numeric: numericValid,
      special: specialValid
    });

    if (lengthValid && uppercaseValid && numericValid && specialValid) {
      setPasswordValidMessage('✔️ Valid password 😊');
    } else {
      setPasswordValidMessage('');
    }

    
  };



  

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };



  const signIn = async () => {
    try {
      const response = await fetch(`${apiUrl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Sign-in response:', data); // Log the full response
  
      if (data.message === 'Sign-in successful') {
        // Store the full user object instead of just the email
        console.log('User data:', data.user);
        //const userId = data.user.id;
        login(data.token, data.user); // Assuming data.user contains the full user object
        console.log('Sign-in successful, session created.');
        setMessage('Sign-in successful');
        setSignInSuccess(true);
        setTimeout(() => {
          navigate('/home'); // Redirect to the home page after successful sign-in
        }, 5000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred during sign-in');
    }
  };
  



  const requestOtp = async (e) => {
    e.preventDefault();

    try {
      const identifier = authType === 'mobile' ? countryCode + mobileNumber : email;

      const response = await fetch(`${apiUrl}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authType, identifier }),
      });

      const data = await response.json();

      if (data.message.startsWith('OTP sent')) {
        setOtpSent(true);
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: authType === 'mobile' ? countryCode + mobileNumber : email, otp }),
      });

      const data = await response.json();

      if (data.message === 'OTP verified, sign-in successful') {
        setMessage('OTP verified');
        setIsSignedIn(true); // Update sign-in status
        setOtpSent(true);
        setSignInSuccess(true);

        
        
        // Navigate to HomePage2 after successful sign-in
        // Display success message for 2 seconds before navigating
        setTimeout(() => {
          navigate('/home');
        }, 10000); // 2000ms = 2 seconds
        //signIn(); // Call the signIn function from the context

        //console.log('Navigating to home page');
        //navigate('/');

        
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message || 'Invalid OTP');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobileNumber, password, countryCode }),
      });

      const data = await response.json();

      if (data.message === 'Signup successful') {
        setMessage('Signup successful, please sign in');
        setSignUp(false); // Switch back to sign-in form
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="sign-in-container">
      <h1>{signUp ? 'Sign Up' : 'Sign In'} to Livi Shield</h1>
      <p>{signUp ? 'Create a new account' : 'For a more personalized experience, sign in with your registered mobile number or email ID'}</p>

      {signUp ? (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="name-input"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email ID"
            required
            className="email-input"
          />
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            required
            className="country-code-dropdown"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your mobile number"
            className="mobile-number-input"
          />
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
            className="password-input"
          />
           <p style={{ color: passwordValidMessage ? 'green' : 'red' }}>
              {passwordValidMessage}
            </p>
          <div className="password-validation">
            <p style={{ color: passwordValid.length ? 'green' : 'red' }}>
              {passwordValid.length ? '✓ ' : ''} At least 8 characters
            </p>
            <p style={{ color: passwordValid.uppercase ? 'green' : 'red' }}>
              {passwordValid.uppercase ? '✓ ' : ''} At least 1 capital letter
            </p>
            <p style={{ color: passwordValid.numeric ? 'green' : 'red' }}>
              {passwordValid.numeric ? '✓ ' : ''} At least 1 numeric character
            </p>
            <p style={{ color: passwordValid.special ? 'green' : 'red' }}>
              {passwordValid.special ? '✓ ' : ''} At least 1 special character
            </p>
           
            
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      ) : !otpSent ? (
        <form onSubmit={requestOtp}>
          {authType === 'mobile' ? (
            <div className="input-group">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="country-code-dropdown"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                required
                className="mobile-number-input"
              />
            </div>
          ) : (
            <div className="email-signin-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email ID"
              required
              className="email-input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="password-input"
            />
          </div>
            
          )}
          <button onClick={signIn} type="submit" className="request-otp-button">
            Sign In
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP"
            required
            className="otp-input"
          />
          <button type="submit" className="verify-otp-button">
            Verify OTP
          </button>
        </form>
      )}

      <div className="or-section">
        <p>OR</p>
        {signUp ? (
          <button className="switch-auth-button" onClick={() => setSignUp(false)}>
            Already have an account? Sign In
          </button>
        ) : (
          <>
            {authType === 'mobile' ? (
              <button className="switch-auth-button" onClick={() => setAuthType('email')}>
                Sign in with Email ID
              </button>
            ) : (
              <button className="switch-auth-button" onClick={() => setAuthType('mobile')}>
                Sign in with Mobile Number
              </button>
            )}
            <button className="switch-auth-button" onClick={() => setSignUp(true)}>
              Create an account
            </button>
          </>
        )}
        
      </div>
      {message && <p className="message">{message}</p>}
      {signInSuccess && <SuccessAlert message="Sign-in successful! Redirecting..." />}

    </div>
    
  );
}


export default SignIn;
