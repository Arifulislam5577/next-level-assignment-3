import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { TUserServiceResponse } from './user.interface'
import { createNewUser, loginUserService } from './user.service'

// METHOD : POST
// ROUTE : /api/auth/signup
const signup = catchAsync(async (req: Request, res: Response) => {
  const response: TUserServiceResponse = await createNewUser(req.body)
  res.status(response.statusCode).json(response)
})

// METHOD : POST
// ROUTE : /api/auth/login

const login = catchAsync(async (req: Request, res: Response) => {
  const response = await loginUserService(req.body)
  res.status(res.statusCode).json(response)
})

export const authControllers = { signup, login }
