import { Model } from 'mongoose'

export interface TUser {
  name: string
  email: string
  password: string
  phone: string
  address: string
  role: 'user' | 'admin'
}

export interface TUserServiceResponse {
  success: boolean
  statusCode: number
  message: string
  data: Omit<TUser, 'password'> | null
}

export type TUserLogin = {
  email: string
  password: string
}

export interface TUserLoginResponse {
  success: boolean
  statusCode: number
  message: string
  token?: string
  data: TUser | null
}

export interface TUserModel extends Model<TUser> {
  passwordMatch(password: string, hashedPassword: string): Promise<boolean>
}
