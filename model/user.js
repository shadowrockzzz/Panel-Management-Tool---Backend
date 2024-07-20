import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {type: String, unique: true , required: true},
    password: {type: String, required: true},
    role: {type:String,required:false},
    band: {type:String},
    skillSet: {type:String},
    emailId: {type:String},
    ICPCertified: {type:String},
    city: {type:String},
    accountName: {type: String},
    subPractice: {type:String},
    band: {type: String},
    EmpId: {type:String},
    sector:{type:String},
    location: {type:String},
    contactNumber:{type:Number},
    practice:{type:String},
    level:{type:String}
})

export default mongoose.model('Users',userSchema)