import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import AppError from '../global/AppError'
import User from '../modules/user/user.model'
import catchAsync from '../utils/catchAsync'

export const auth = (userRole: 'user' | 'admin') => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
      throw new AppError('You have no access to this route', 400)
    }

    const decoded = jwt.verify(token.split(' ')[1], config.JWT_SECRET_KEY!) as JwtPayload
    const { user } = decoded

    const isUserExists = await User.findById(user.id)

    if (!isUserExists) {
      throw new AppError('You have no access to this route', 400)
    }

    if (user.role !== userRole) {
      throw new AppError('You have no access to this route', 400)
    }

    req.user = decoded
    next()
  })
}
