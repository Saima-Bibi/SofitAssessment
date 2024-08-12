import mongoose from 'mongoose'

const dbCon = async()=>{
try {
    await mongoose.connect(process.env.DBURI)
    console.log("DB connected!!")
} catch (error) {
    console.log(error)
}
}
export  default dbCon