import express from 'express'
import { CreateUser , login, updateUser, deleteUser, addOfficeTimings} from '../controllers/UserController.js'
import validationRules from '../middlewares/validation.js'
import {validateRequest} from '../middlewares/ValidateRequest.js'
import roleBasedAccess from '../middlewares/Auth.js'

const userRouter = express.Router()

userRouter.post('/CreateUser',roleBasedAccess(['admin']),validateRequest(validationRules),CreateUser)
userRouter.post('/login',validateRequest(validationRules),login)
userRouter.put('/updateUser/:id',roleBasedAccess(['admin']),validateRequest(validationRules) , updateUser)
userRouter.delete('/deleteUser/:id',roleBasedAccess(['admin']),validateRequest(validationRules),deleteUser)

userRouter.post('/addOfficeTimings',roleBasedAccess(['admin']),validateRequest(validationRules),addOfficeTimings)


export default userRouter