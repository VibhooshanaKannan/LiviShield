const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For JWT authentication
const logger = require('./logger'); // Import the logger
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined!');
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(5000, () => {
  logger.info('Server is running on port 5000');
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

});

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/livishieldsignup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobileNumber: String,
  password: String,
  countryCode: String,
});

const User = mongoose.model('User', userSchema);


const planSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
});

const Plan = mongoose.model('Plan', planSchema);

app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});




// Define Schema
const familyHealthInsurancePlanSchema = new mongoose.Schema({
  name: String,
  coverage: {
      hospitalization: Boolean,
      pre_hospitalization: Boolean,
      post_hospitalization: Boolean,
      daycare_procedures: Boolean,
      ambulance_charges: Boolean,
      maternity_benefits: Boolean,
      newborn_baby_cover: Boolean,
      AYUSH_treatment: Boolean,
      domiciliary_hospitalization: Boolean,
      organ_donor_expenses: Boolean,
      critical_illness_cover: Boolean,
      personal_accident_cover: Boolean
  },
  additional_features: {
      cashless_hospitalization: Boolean,
      room_rent_cap: Boolean,
      cumulative_bonus: Boolean,
      restoration_benefit: Boolean,
      sub_limits: Boolean,
      optional_add_ons: {
          maternity: Boolean,
          critical_illness: Boolean,
          AYUSH: Boolean,
          domiciliary: Boolean
      }
  },
  sum_insured: Number,
  network_hospitals: [String],
  co_payment: Number,
  waiting_period: {
      pre_existing_diseases: Number,
      maternity: Number,
      critical_illness: Number
  },
  exclusions: [String],
  premium: Number
});

const FamilyHealthInsurancePlan = mongoose.model('FamilyHealthInsurancePlan', familyHealthInsurancePlanSchema);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Routes
app.get('/familyhealthinsuranceplans', async (req, res) => {
  const plans = await FamilyHealthInsurancePlan.find();
  res.json(plans);
});

app.get('/familyhealthinsuranceplans/:id', async (req, res) => {
  const plan = await FamilyHealthInsurancePlan.findById(req.params.id);
  res.json(plan);
});

app.post('/familyhealthinsuranceplans', async (req, res) => {
  const newPlan = new FamilyHealthInsurancePlan(req.body);
  await newPlan.save();
  res.json(newPlan);
});

app.put('/familyhealthinsuranceplans/:id', async (req, res) => {
  const updatedPlan = await FamilyHealthInsurancePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPlan);
});

app.delete('/familyhealthinsuranceplans/:id', async (req, res) => {
  await FamilyHealthInsurancePlan.findByIdAndDelete(req.params.id);
  res.json({ message: 'Plan deleted' });
});


// Sign-in route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`User with email ${email} not found`);
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid password for email ${email}`);
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`User signed in successfully: ${email}`);
    
    // Include user data in response
    res.status(200).send({
      message: 'Sign-in successful',
      token,
      user: { // Include the user object here
        _id: user._id,
        name: user.name, // Adjust according to your user schema
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(`Error during sign-in for ${email}: ${error}`);
    res.status(500).send({ message: 'Failed to sign in' });
  }
});


// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, mobileNumber, password, countryCode } = req.body;

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, mobileNumber, password: hashedPassword, countryCode });
    await user.save();
    logger.info(`User signed up successfully: ${email}`);
    res.status(201).send({ message: 'Signup successful' });
  } catch (error) {
    logger.error(`Error during signup for ${email}: ${error}`);
    res.status(500).send({ message: 'Failed to sign up' });
  }
});



const proposalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Ensures that the user field is required
  },
  proposerDetails: {
    name: String,
    gender: String,
    pan: String,
    dob: Date,
    address: String,
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    email: String,
    mobile: String
  },
  medicalQuestions: {
    smoke: String,
    hospitalized: String,
    filedClaim: String,
    declined: String,
    religareCovered: String
  },
  nomineeDetails: {
    nomineeFullName: String,
    nomineeRelationship: String,
    nomineeLastName: String
  },
  selectedPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyHealthInsurancePlan', // Changed to reference the correct plan model
    required: true
  },
  
  planDetails: {
    name: String,
    coverage: {
      hospitalization: Boolean,
      pre_hospitalization: Boolean,
      post_hospitalization: Boolean,
      daycare_procedures: Boolean,
      ambulance_charges: Boolean,
      maternity_benefits: Boolean,
      newborn_baby_cover: Boolean,
      AYUSH_treatment: Boolean,
      domiciliary_hospitalization: Boolean,
      organ_donor_expenses: Boolean,
      critical_illness_cover: Boolean,
      personal_accident_cover: Boolean
    },
    additional_features: {
      cashless_hospitalization: Boolean,
      room_rent_cap: Boolean,
      cumulative_bonus: Boolean,
      restoration_benefit: Boolean,
      sub_limits: Boolean,
      optional_add_ons: {
        maternity: Boolean,
        critical_illness: Boolean,
        AYUSH: Boolean,
        domiciliary: Boolean
      }
    },
    sum_insured: Number,
    network_hospitals: [String],
    co_payment: Number,
    waiting_period: {
      pre_existing_diseases: Number,
      maternity: Number,
      critical_illness: Number
    },
    exclusions: [String],
    premium: Number
  },
  
  calculatedPremium: Number,
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'renewed'],
    default: 'pending'
  }

  
});

const Proposal = mongoose.model('Proposal', proposalSchema);



// Route to create a new proposal
app.post('/proposals', async (req, res) => {
  console.log('Received proposal:', req.body); // Log the request body
  try {
    const { user, proposerDetails, medicalQuestions, nomineeDetails, selectedPlan, calculatedPremium } = req.body;

    // Ensure required fields are provided
    if (!user || !selectedPlan || !calculatedPremium) {
      return res.status(400).send({ message: 'User, selected plan, and calculated premium are required' });
    }

    // Fetch plan details
    const plan = await FamilyHealthInsurancePlan.findById(selectedPlan);
    if (!plan) {
      return res.status(400).send({ message: 'Selected plan not found' });
    }

    const proposal = new Proposal({
      user,
      proposerDetails,
      medicalQuestions,
      nomineeDetails,
      selectedPlan,
      planDetails: plan, // Save plan details
      calculatedPremium
    });

    await proposal.save();
    res.status(201).send({ message: 'Proposal saved successfully', proposal });
  } catch (error) {
    console.error('Error saving proposal:', error);
    res.status(500).send({ message: 'Failed to save proposal' });
  }
});


app.get('/proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find().populate('user').populate('selectedPlan');
    res.status(200).send(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).send({ message: 'Failed to fetch proposals' });
  }
});


// Route to get a proposal by ID
app.get('/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('user').populate('selectedPlan');
    if (!proposal) {
      return res.status(404).send({ message: 'Proposal not found' });
    }
    res.status(200).send(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).send({ message: 'Failed to fetch proposal' });
  }
});



// Route to update a proposal by ID
app.put('/proposals/:id', async (req, res) => {
  try {
    const { proposerDetails, medicalQuestions, nomineeDetails, selectedPlan, calculatedPremium } = req.body;

    // Fetch plan details
    const plan = await FamilyHealthInsurancePlan.findById(selectedPlan);
    if (!plan) {
      return res.status(400).send({ message: 'Selected plan not found' });
    }

    const proposal = await Proposal.findByIdAndUpdate(req.params.id, {
      proposerDetails,
      medicalQuestions,
      nomineeDetails,
      selectedPlan,
      planDetails: plan, // Update plan details
      calculatedPremium
    }, { new: true }).populate('user').populate('selectedPlan');

    if (!proposal) {
      return res.status(404).send({ message: 'Proposal not found' });
    }
    res.status(200).send(proposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).send({ message: 'Failed to update proposal' });
  }
});


// Route to delete a proposal by ID
app.delete('/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!proposal) {
      return res.status(404).send({ message: 'Proposal not found' });
    }
    res.status(200).send({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).send({ message: 'Failed to delete proposal' });
  }
});


// Route to get proposals for the current user
app.get('/proposals/user/:userId', async (req, res) => {
  try {
    const proposals = await Proposal.find({ user: req.params.userId })
      .populate('user')
      .populate('selectedPlan');
    res.status(200).send(proposals);
  } catch (error) {
    console.error('Error fetching proposals for user:', error);
    res.status(500).send({ message: 'Failed to fetch proposals' });
  }
});



// Define the Car Plan schema
const carPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  features: { type: [String], required: true },
  claimBenefits: { type: [String], required: true },
  amount: { type: Number, required: true }
});

// Define the Car Proposal schema
const carProposalSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  aadhaar: { type: String, required: true },
  houseNumber: { type: String, required: true },
  streetName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  carMake: { type: String, required: true },
  carModel: { type: String, required: true },
  carYear: { type: Number, required: true },
  carLicensePlate: { type: String, required: true },
  fuelType: { type: String },
  idv: { type: String, required: true },
  coverageType: { type: String },
  addOns: { type: [String] },
  modifications: { type: String },
  healthConditions: { type: String },
  medications: { type: String },
  accidents: { type: String },
  licenseSuspension: { type: String },
  declaration: { type: Boolean, required: true }
});

// Create Mongoose models
const CarPlan = mongoose.model('CarPlan', carPlanSchema);
const CarProposal = mongoose.model('CarProposal', carProposalSchema);

// Route to get all car plans
app.get('/carPlans', async (req, res) => {
  try {
      const plans = await CarPlan.find();
      res.status(200).json(plans);
  } catch (err) {
      res.status(500).json({ error: "Error fetching car plans" });
  }
});

// Route to get all car proposals
app.get('/carProposals', async (req, res) => {
  try {
      const proposals = await CarProposal.find();
      res.status(200).json(proposals);
  } catch (err) {
      res.status(500).json({ error: "Error fetching car proposals" });
  }
});


// Route to submit a new car proposal
app.post('/carProposals', async (req, res) => {
  try {
    // Create a new car proposal from the request body
    const newProposal = new CarProposal({
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      dob: req.body.dob,
      aadhaar: req.body.aadhaar,
      houseNumber: req.body.houseNumber,
      streetName: req.body.streetName,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
      carMake: req.body.carMake,
      carModel: req.body.carModel,
      carYear: req.body.carYear,
      carLicensePlate: req.body.carLicensePlate,
      fuelType: req.body.fuelType,
      idv: req.body.idv,
      coverageType: req.body.coverageType,
      addOns: req.body.addOns,
      modifications: req.body.modifications,
      healthConditions: req.body.healthConditions,
      medications: req.body.medications,
      accidents: req.body.accidents,
      licenseSuspension: req.body.licenseSuspension,
      declaration: req.body.declaration
    });

    // Save the proposal to the database
    const savedProposal = await newProposal.save();

    // Respond with success message
    res.status(201).json({
      message: 'Car proposal submitted successfully',
      proposal: savedProposal
    });
  } catch (err) {
    // Handle any errors and respond with error message
    res.status(500).json({
      error: 'Error submitting car proposal',
      details: err.message
    });
  }
});





app.get('/api/proposals/:userId', async (req, res) => {
  const userId = req.params.userId; // This should get the userId from the URL
  console.log('Fetching proposals for User ID:', userId); // Check the value
  try {
      // Fetch proposals based on the userId
      const proposals = await Proposal.find({ user: userId });
      console.log('Fetched Proposals:', proposals);

      // Calculate the total premium
      const totalPremium = proposals.reduce((acc, proposal) => {
        return acc + (proposal.planDetails.calculatedPremium || 0); // Add each proposal's premium to the accumulator
    }, 0);

    console.log('Total Amount to Pay:', totalPremium); // Log the total
      res.status(200).json(proposals);
  } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get('/api/car-proposals/:fullName', async (req, res) => {
  try {
    const fullName = req.params.fullName; // Get the fullName from the request parameters
    const carProposals = await CarProposal.find({ fullName }); // Fetch proposals based on fullName
    res.json(carProposals);
  } catch (error) {
    console.error('Error fetching car proposals:', error);
    res.status(500).send('Internal Server Error');
  }
});





// GET endpoint to check proposal status
app.get('/proposals/:proposalId/status', async (req, res) => {
  try {
    // Validate proposal ID
    if (!mongoose.Types.ObjectId.isValid(req.params.proposalId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid proposal ID format'
      });
    }

    const proposalId = req.params.proposalId;
    
    // Find the proposal
    const proposal = await Proposal.findById(proposalId)
      .populate('user')
      .populate('selectedPlan');

    // Check if proposal exists
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Return the proposal status
    return res.status(200).json({
      success: true,
      status: proposal.status || 'pending',
      proposal: proposal
    });

  } catch (error) {
    console.error('Error fetching proposal status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});






// Add the new route to update proposal status
// PUT endpoint to mark proposal as paid
app.put('/proposals/:proposalId/status', async (req, res) => {
  try {
    // Validate proposal ID
    if (!mongoose.Types.ObjectId.isValid(req.params.proposalId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid proposal ID format'
      });
    }

    const proposalId = req.params.proposalId;

    // Find the proposal first to check if it exists and isn't already paid
    const existingProposal = await Proposal.findById(proposalId);
    
    if (!existingProposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    if (existingProposal.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Proposal is already marked as paid'
      });
    }
    
    // Update the proposal status to paid
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: 'paid' },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    ).populate('user').populate('selectedPlan');

    // Log the status change
    console.log(`Proposal ${proposalId} status updated to paid`);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Proposal status updated to paid successfully',
      data: updatedProposal
    });

  } catch (error) {
    console.error('Error updating proposal status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});



// Renewal model
const renewalSchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  vehicleDetails: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true },
    mileage: { type: String, required: true },
  },
  premiumAmount: { type: Number, required: true },
  paymentOption: { type: String, required: true },
  policyholderInfo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
  },
  confirmation: { type: Boolean, default: false },  // To track confirmation status
});
const Renewal = mongoose.model('Renewal', renewalSchema);




// Submit a new renewal
app.post('/api/renewals', async (req, res) => {
  const renewalData = req.body;
  console.log("Received renewal data:", renewalData); // Log the incoming data

  try {
    const newRenewal = new Renewal(renewalData);
    await newRenewal.save();

    res.status(201).json({ 
      message: 'Renewal saved successfully!', 
      renewalId: newRenewal._id // Return the ID in the response
    });
  } catch (error) {
    console.error("Error saving renewal:", error.message); // Log error details
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/renewals', async (req, res) => {
  try {
    const renewals = await Renewal.find();
    res.json(renewals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
