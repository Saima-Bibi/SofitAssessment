import mongoose from "mongoose";

const officeTimeSchema = new mongoose.Schema({

    startTime:{ type:String , required: true,},
    endTime:{ type:String , required: true,},
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref:"User", required:true}
},{timestamps:true})

const OfficeTimeModel = mongoose.model("OfficeTime",officeTimeSchema)
export default OfficeTimeModel