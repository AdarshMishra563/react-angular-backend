const express=require('express');
const router=express.Router();
const User=require("./User");

const {registerUser,login}=require('./auth-controller');
router.post('/register',registerUser);
router.post('/login',login);
module.exports=router;