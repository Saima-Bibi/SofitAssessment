import mongoose, { Mongoose } from "mongoose";

const UserSchema = new Mongoose.Schema({

    name:{ type:String , required: true, },
    email:{ type:String , required: true,},
    password:{ type:String , required: true,},
    role:{enum:['admin','employee']}

},{timestamps:true})

export default UserSchema 