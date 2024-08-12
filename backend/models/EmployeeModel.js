import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
    userID:{type: mongoose.Schema.Types.ObjectId, ref:"User",required:true},
    name:{type:String , required: true,},
    checkIn :{type:String , required: true,},
    checkOut:{type:String , required: true,}

},{timestamps:true})
const EmployeeModel = mongoose.model('Employee',employeeSchema)
export default EmployeeModel
