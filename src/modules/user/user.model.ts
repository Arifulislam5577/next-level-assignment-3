import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'
import { IUser, IUserModel } from './user.interface'

const UserSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String, select: 0 },
    phone: { type: String },
    address: { type: String },
    role: { type: String, default: 'user' }
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
