import express from 'express'
import dbCon from './utils/DB.js'
import cors from 'cors'
import dotenv from 'dotenv'


const app = express()

dotenv.config()

dbCon()

app.use(cors)
app.use(express.json())

app.listen(process.env.PORT,()=>{
console.log(`Server is running on ${process.env.PORT}...`)
})
