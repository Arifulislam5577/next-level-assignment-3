import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { createNewUser, loginUserService } from './user.service'

// METHOD : POST
// ROUTE : /api/auth/signup
const signup = catchAsync(async (req: Request, res: Response) => {
  const data = await createNewUser(req.body)
  res.status(data.statusCode).json(data)
})

// METHOD : POST
// ROUTE : /api/auth/login

const login = catchAsync(async (req: Request, res: Response) => {
  const data = await loginUserService(req.body)
  res.status(data.statusCode).json(data)
})

export const authControllers = { signup, login }
