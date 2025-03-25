const mongoose = require("mongoose");
const Schema=new mongoose.Schema({
email:{type:String, required: true},
amount:{type:Number,rquired:true},
Paymentstatus:String,
service:String,




},{ timestamps: true });

const UserPayments = mongoose.model("payment", Schema);
module.exports=UserPayments;