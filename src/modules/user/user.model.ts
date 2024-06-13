import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'
import { IUser, IUserModel } from './user.interface'

const UserSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, unique: true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'], select: 0 },
    phone: { type: String, required: [true, 'Phone is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: [true, 'Role is required']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password
        return ret
      }
    }
  }
)

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(12))
  next()
})

UserSchema.statics.passwordMatch = async function (password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

const User = mongoose.model<IUser, IUserModel>('User', UserSchema)

export default User
