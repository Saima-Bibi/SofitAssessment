import express from 'express'
import dbCon from './utils/DB.js'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js'
import bodyParser from 'body-parser'


dotenv.config()

const app = express()


app.use(cors())

  app.use(express.json())


 

const PORT = process.env.PORT || 4006
dbCon()

app.use('/users',userRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}!!`)
})