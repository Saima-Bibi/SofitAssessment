import express from 'express'
import { CreateUser } from '../controllers/UserController'

const userRouter = express.Router()

userRouter.post('/CreateUser',CreateUser)

export default userRouter