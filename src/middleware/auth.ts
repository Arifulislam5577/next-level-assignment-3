import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import AppError from '../global/AppError'
import User from '../modules/user/user.model'
import catchAsync from '../utils/catchAsync'

export const auth = (userRole: 'user' | 'admin') => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization

    if (!token) {
      throw new AppError('Unauthorized user', 401)
    }

    const decoded = jwt.verify(token.split(' ')[1], config.JWT_SECRET_KEY!) as JwtPayload
    const { user } = decoded

    const isUserExists = await User.findById(user.id)

    if (!isUserExists) {
      throw new AppError('No user found', 404)
    }

    if (user.role !== userRole) {
      throw new AppError('Unauthorized user', 401)
    }

    req.user = decoded
    next()
  })
}
