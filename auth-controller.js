const User=require("./User");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv')
require('dotenv').config();
const Stripe = require('stripe');
const adminemail=process.env.EMAIL;
const adminpass=process.env.PASSWORD;
const adminpassword=bcrypt.hashSync(adminpass, 12);
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
console.log(stripe);

const registerUser = async (req, res) => {
    try {
      console.log(" Incoming Request Body:", req.body);
      
      const { name, email, password } = req.body;
  
      if (!name || !email || !password ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
  console.log(req.body)
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
  
      
      const hashedPassword =await bcrypt.hash(password, 12);

  
      
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      
      });
  
      console.log("User Created:", newUser);
  
      res.status(201).json({
        success: true,
        message: "Registered successfully",
      });
    } catch (error) {
      console.error(" Registration Error:", error);
      res.status(500).json({
        success: false,
        message: "Some error occurred",
      });
    }
  };



  const login = async (req, res) => {
    const { email, password } = req.body;
  console.log(req.body)
  if ( !email || !password ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
    if (email === adminemail) {
   
      const isMatch = await bcrypt.compare(password,`${adminpassword}`);
  
      if (isMatch) {
        return res.status(200).json({ status: 'admin', message: 'Login successful as Admin' });
      } else {
        return res.status(401).json({ message: 'Invalid Admin credentials' });
      }
    }
  const user=await User.findOne({email,password})
    
    if(user){ return res.status(200).json({ status: 'user', message: 'Login successful as User',user:user });}else{
        return res.status(401).json({ message: 'Invalid User credentials' });
    }
  };

const stripePayment = async (req, res) => {

console.log(req.body)
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }}


  module.exports = {registerUser,login,stripePayment};