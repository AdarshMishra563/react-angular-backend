const User=require("./User");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv')
require('dotenv').config();
const Stripe = require('stripe');
const UserPayments = require("./payment-schema");
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
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    
    if (email === adminemail) {
      const isMatch = await bcrypt.compare(password, adminpassword);
      
      if (isMatch) {
        return res.status(200).json({ status: 'admin', message: 'Login successful as Admin' });
      } else {
        return res.status(401).json({ message: 'Invalid Admin credentials' });
      }
    }

  
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Email' });
    }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid User password' });
  }

  return res.status(200).json({ status: 'admin', message: 'Login successful as User', user:user });
  
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Something went wrong, please try again later.' });
}
};
const stripePayment = async (req, res) => {
  console.log(req.body);

  try {
    const { amount, currency, email, service } = req.body;

   
    const customer = await stripe.customers.create({
      email,
      description: `Customer for ${email}`,
    });

    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      description: `Payment for ${service}`,
    });

   
    await stripe.invoiceItems.create({
      customer: customer.id,
      amount,
      currency,
      description: `Charge for ${service}`,
    });

   
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      description: `Invoice for ${service}`,
    });

   const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);


    res.json({ 
      clientSecret: paymentIntent.client_secret, 
      invoiceUrl: finalizedInvoice.invoice_pdf,
     
    });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const payment=async (req,res)=>{
try{
  const {email,amount,Paymentstatus,service}=req.body;
const data=await UserPayments.create({
  email,amount,Paymentstatus,service
})
res.status(201).json({
  success: true,
  message: "Payment-Initiated",
});
}catch(err){res.status(500).json({error:err.message})}



}



const getpayment = async (req, res) => {
  try {
    const { email } = req.params;
    const find = await UserPayments.find({ email });

    if (find.length > 0) {
      res.json({ message: "Users found", users: find, status: true });
    } else {
      res.json({ status: false, message: "No users found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};


  module.exports = {registerUser,login,payment,stripePayment,getpayment};


   
