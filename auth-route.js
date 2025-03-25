const express=require('express');
const router=express.Router();
const User=require("./User");

const {registerUser,login, stripePayment, payment, getpayment}=require('./auth-controller');
router.post('/register',registerUser);
router.post('/login',login);
router.post('/payment-intent',stripePayment);
router.post('/payment',payment);
router.get('/getpayment/:email',getpayment);

module.exports=router;
