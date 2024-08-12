import UserModel from "../models/UserModel.js"
import bcryptjs from 'bcryptjs'
import { emailSender } from "../services/emailSender.js"
import jwt from "jsonwebtoken"
import OfficeTimeModel from "../models/officeTimeModel.js"

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
          const Token = jwt.sign({userId:user._id, role:user.role},process.env.SECRET_KEY,{expiresIn:"3d"})
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

export {CreateUser,login, updateUser, deleteUser, addOfficeTimings}