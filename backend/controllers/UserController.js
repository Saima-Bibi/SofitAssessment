import UserModel from "../models/UserModel.js"
import bcryptjs from 'bcryptjs'
import { emailSender } from "../services/emailSender.js"
import jwt from "jsonwebtoken"
import OfficeTimeModel from "../models/officeTimeModel.js"

import AttendanceModel from "../models/AttendanceModel.js"
import moment from "moment/moment.js"
import exceljs from 'exceljs'


const CreateUser =  async(req,res)=>{

try {
  
const{name,email,password,role}=req.body
console.log(req.body)
const user = await UserModel.findOne({email})

if(user){
  return  res.status(401).json({message:'user already exist'})
}
const hashedPassword = await bcryptjs.hash(password,10)
const newUser = new UserModel({name,email,password:hashedPassword,role})
await newUser.save()
console.log(newUser)
const obj = {
    email:newUser.email,
    subject: process.env.EMAILSUBJECT,
    text:`${process.env.EMAILTEXT}`+ `email: ${newUser.email} password: ${password} role:${newUser.role}`

}
 const result=await emailSender(obj)

return res.status(200).json({message:"User account created successfully",result})

} catch (error) {
    
    console.log(error)
   return  res.status(500).json({message:"Internal server error"})
    
}

}


const login = async (req, res) => {
    try {
        
        const{email,password} =req.body

        const user = await UserModel.findOne({email})
    
        if(!user){
            return  res.status(401).json({message:'user not found'})
          }
        
        const isverified = await bcryptjs.compare(password, user.password)  
    
        if(!isverified){
            return  res.status(401).json({message:'Invalid password'})
          }
          const Token = jwt.sign({userId:user._id,name:user.name, role:user.role},process.env.SECRET_KEY,{expiresIn:"3d"})
          return res.status(200).json({  message: "Login succesfully", name: user.name, email: user.email,  Token }) 

    } catch (error) {
        console.log(error)
        return  res.status(500).json({message:"Internal server error"})
    }
}

const updateUser = async(req,res)=>{
try {
    

    const {id}= req.params
    const{name,email,password,role}=req.body
    
   
      const hashedPassword = await bcryptjs.hash(password,10)
      const updatedUser = await UserModel.findByIdAndUpdate(id,{name:name,email:email,password:hashedPassword,role:role},{new:true})
     
      if(!updatedUser){
        return  res.status(401).json({message:'user not found'})
      }
      const obj = {
        email:updatedUser.email,
        subject: process.env.EMAILSUBJECT,
        text:`Your Account  is updated, Your credentials are:`+ `name: ${updatedUser.name} email: ${updatedUser.email} password: ${password} role:${updatedUser.role}`
    
    }
      const result=await emailSender(obj)
      return res.status(200).json({message:"User account updated successfully",result})

} catch (error) {
    console.log(error)
    return  res.status(500).json({message:"Internal server error"})
}

}

const deleteUser = async(req,res)=>{
 try {
    
    const {id}= req.params

    const deletedUser = await UserModel.findByIdAndDelete(id)

    if(!deletedUser){
        return  res.status(401).json({message:'user not found'})
      }
      return  res.status(200).json({message:"User deleted successfully"})
      

 } catch (error) {
    console.log(error)
    return  res.status(500).json({message:"Internal server error"})
 }

}


const addOfficeTimings = async(req,res)=>{

    try {
        const{startTime,endTime} = req.body

        const time = new OfficeTimeModel({startTime,endTime, createdBy:req.user.userId})
        await time.save()

        return res.status(200).json({message:"Office timings added successfully",time})
    } catch (error) {
        console.log(error)
        return  res.status(500).json({message:"Internal server error"})
    }
    


}


const addInOutTimings = async(req,res)=>{
try {
    
     const{day,checkIn,checkOut} = req.body

     const officeTime = await OfficeTimeModel.findOne()
     if(!officeTime){
      res.status(401).json({message:"office timings are not set"})
     }
     const officeStartTime = moment(officeTime.startTime, 'hh:mm A');
     const officeEndTime = moment(officeTime.endTime, 'hh:mm A');
     const employeeCheckInTime = moment(checkIn, 'hh:mm A');
     const employeeCheckOutTime = moment(checkOut, 'hh:mm A');
     if(checkIn > officeStartTime || checkOut > officeEndTime){
        
     }

     const time = new AttendanceModel({
        date: new Date(),
        day,
        userID: req.user.userId, 
        name:req.user.name, 
        checkIn,
        checkOut,
        checkInEarly: employeeCheckInTime.isBefore(officeStartTime),
        checkInLate: employeeCheckInTime.isAfter(officeStartTime),
        checkOutEarly: employeeCheckOutTime.isBefore(officeEndTime),
        checkOutLate: employeeCheckOutTime.isAfter(officeEndTime), 

      })
     await time.save()

     return res.status(200).json({message:"Attendance recorded successfully",time})

} catch (error) {
    
    console.log(error)
    return  res.status(500).json({message:"Internal server error"})
}
}

const getAttendence = async(req,res)=>{
 try {
    

    const attendances = await AttendanceModel.find({
        $and: [
          req.query.name ? { name: { $regex: req.query.name, $options: 'i' } } : {},
          req.query.day ? { day: { $regex: req.query.day, $options: 'i' } }  : {}
        ]
      });

      if(!attendances){
        return  res.status(401).json({message:'not found'})
      }

   return  res.status(200).json(attendances);
  }  catch (error) {
    console.log(error)
    return  res.status(500).json({message:"Internal server error"})
 }
}

const getAttendenceFile = async(req,res)=>{
    try {
        
        const attendances = await AttendanceModel.find()

       
    const workbook = new exceljs.Workbook()
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
     { header: 'Date', key: 'date', width: 30 },
      { header: 'Day', key: 'day', width: 30 },
      { header: 'userID', key: 'userID', width: 30 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Check-in Time', key: 'checkInTime', width: 30 },
      { header: 'Check-out Time', key: 'checkOutTime', width: 30 },
      { header: 'check-In-Early', key: 'checkInEarly', width: 30 },
      { header: 'check-In-Late', key: 'checkInLate', width: 30 },
      { header: 'check-Out-Early', key: 'checkOutEarly', width: 30 },
      { header: 'check-Out-Late', key: 'checkOutLate', width: 30 },
    ];

   
    attendances.forEach(att => {
      worksheet.addRow({
        date:att.date,
        day:att.day,
        _id: att._id,
        name: att.name,
        checkInTime: att.checkIn,
        checkOutTime: att.checkOut,
        checkInEarly: att.checkInEarly,
        checkInLate:att.checkInLate,
        checkOutEarly:att.checkOutEarly,
        checkOutLate:att.checkOutLate,
        
      });
    });

   

    worksheet.getRow(1).eachCell((cell) => {
        { cell.font = { bold: true } }
    })
    res.setHeader(
        "Content-Type",
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=transactions.xlsx`
    )


    return workbook.xlsx.write(res).then(() =>
        console.log('excel file downloaded')
    )


    } catch (error) {
        console.log(error)
    return  res.status(500).json({message:"Internal server error"})
    }
}

export {CreateUser,login, updateUser, deleteUser, addOfficeTimings, addInOutTimings, getAttendence, getAttendenceFile}