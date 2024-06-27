import { generateJwtToken } from '../../utils/generateJwtToken'
import { IUser, IUserLogin, IUserLoginResponse, IUserServiceResponse } from './user.interface'
import User from './user.model'

export const createNewUser = async (userData: IUser): Promise<IUserServiceResponse> => {
  const isUserExists = await User.findOne({ email: userData.email })

  if (isUserExists) {
    return {
      success: false,
      statusCode: 400,
      message: 'User already exists'
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
}

export const loginUserService = async ({ email, password }: IUserLogin): Promise<IUserLoginResponse> => {
  const user = await User.findOne({ email }).select('+password')

  if (user && (await User.passwordMatch(password, user.password))) {
    const token = generateJwtToken({ id: user._id, role: user.role })
    return {
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      token: token,
      data: user
    }
  } else {
    return {
      success: false,
      statusCode: 400,
      message: 'Invalid email or password'
    }
  }
}
