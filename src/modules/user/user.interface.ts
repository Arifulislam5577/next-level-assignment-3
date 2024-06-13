import { Model } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  phone: string
  address: string
  role: 'user' | 'admin'
}

export interface IUserServiceResponse {
  success: boolean
  statusCode: number
  message: string
  data?: Omit<IUser, 'password'> | null
}

export type IUserLogin = {
  email: string
  password: string
}

export interface IUserLoginResponse {
  success: boolean
  statusCode: number
  message: string
  token?: string
  data?: IUser | null
}

export interface IUserModel extends Model<IUser> {
  passwordMatch(password: string, hashedPassword: string): Promise<boolean>
}
