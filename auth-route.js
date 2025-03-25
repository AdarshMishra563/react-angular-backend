const express=require('express');
const router=express.Router();
const User=require("./User");

const {registerUser,login, stripePayment}=require('./auth-controller');
router.post('/register',registerUser);
router.post('/login',login);
router.post('/payment-intent',stripePayment);

module.exports=router;