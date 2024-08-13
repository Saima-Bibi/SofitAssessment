import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
    date:{type : Date ,required:true},
    day:{type:String , required: true,},
    userID:{type: mongoose.Schema.Types.ObjectId, ref:"User",required:true},
    name:{type:String , required: true,},
    checkIn :{type:String , required: true,},
    checkOut:{type:String , required: true,},
    checkInEarly:{type:Boolean, required:true},
    checkInLate:{type:Boolean, required:true},
    checkOutEarly:{type:Boolean, required:true},
    checkOutLate:{type:Boolean, required:true},
},{timestamps:true})
const AttendanceModel = mongoose.model('Attendence',attendanceSchema)
export default AttendanceModel