const mongoose=require('mongoose');
const express=require('express');
const cors = require('cors');
const app=express();
app.use(cors());
app.use(express.json());
const { ServerApiVersion } = require("mongodb");
app.use(express.json());

const db=require('./db');
db();
const User=require("./User");

const authRoute=require('./auth-route');
app.use('/api',authRoute);
app.get('/',async (req,res)=>{
   
 
  const result =  await User.find();
  
  console.log(result)
  res.status(200).json({ data: result, message: 'Data received successfully' });

})

app.listen(3000,()=>{
console.log("server started at 3000")
})