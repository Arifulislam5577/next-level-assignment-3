import { generateJwtToken } from '../../utils/generateJwtToken'
import { TUser, TUserLogin, TUserLoginResponse, TUserServiceResponse } from './user.interface'
import User from './user.model'

export const createNewUser = async (userData: TUser): Promise<TUserServiceResponse> => {
  try {
    const isUserExists = await User.findOne({ email: userData.email })

    if (isUserExists) {
      return {
        success: false,
        statusCode: 400,
        message: 'User already exists',
        data: null
      }
    } else {
      const user = await User.create({ ...userData })

      return {
        success: true,
        statusCode: 201,
        message: 'User created successfully',
        data: user
      }
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

export const loginUserService = async ({ email, password }: TUserLogin): Promise<TUserLoginResponse> => {
  try {
    const user = await User.findOne({ email }).select('+password')

    if (user && (await User.passwordMatch(password, user.password))) {
      const token = generateJwtToken({ id: user._id, role: user.role })
      return {
        success: true,
        statusCode: 200,
        message: 'User logged in successfully',
        token: `Bearer ${token}`,
        data: user
      }
    } else {
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid email or password',
        data: null
      }
    }
  } catch (error:any) {
    throw new Error(error)
  }
}
