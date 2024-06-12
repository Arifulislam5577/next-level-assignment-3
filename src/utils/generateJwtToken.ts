import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import config from '../config'

export const generateJwtToken = (user: { id: mongoose.Types.ObjectId; role: 'user' | 'admin' }) => {
  return jwt.sign({ user }, config.JWT_SECRET_KEY!, { expiresIn: '30d' })
}
