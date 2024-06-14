import mongoose, { Schema } from 'mongoose'
import AppError from '../../global/AppError'
import Room from '../room/room.model'
import Slot from '../slot/slot.model'
import User from '../user/user.model'
import { IBooking } from './booking.interface'

const BookingSchema = new Schema<IBooking>(
  {
    date: { type: String, required: [true, 'Date is required'] },
    slots: [{ type: Schema.Types.ObjectId, required: [true, 'Slots are required'], ref: 'Slot' }],
    room: { type: Schema.Types.ObjectId, required: [true, 'Room is required'], ref: 'Room' },
    user: { type: Schema.Types.ObjectId, required: [true, 'User is required'], ref: 'User' },
    totalAmount: { type: Number },
    isConfirmed: { type: String, enum: ['unconfirmed', 'confirmed', 'cancelled'], default: 'unconfirmed' },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

BookingSchema.pre('save', async function (next) {
  const bookingRoom = await Room.findById(this.room)
  if (!bookingRoom) {
    throw new AppError('Booking room not found', 404)
  } else if (bookingRoom.isDeleted) {
    throw new AppError('Booking room already deleted', 400)
  } else {
    next()
  }
})

BookingSchema.pre('save', async function (next) {
  const bookingUser = await User.findById(this.user)
  if (!bookingUser) {
    throw new AppError('User not found', 404)
  } else {
    next()
  }
})

BookingSchema.pre('save', async function (next) {
  const slotInTheRoom = await Slot.find({ $and: [{ _id: { $in: this.slots } }, { room: this.room }] })
  if (slotInTheRoom.length <= 0) {
    throw new AppError('Room id does not match with any slot', 400)
  }

  next()
})

BookingSchema.pre('save', async function (next) {
  const isSlotBooked = await Slot.find({
    $and: [{ _id: { $in: this.slots } }, { room: this.room }, { isBooked: false }]
  })

  if (isSlotBooked.length !== this.slots.length) {
    throw new AppError('One or more slots are already booked or not exist', 400)
  }

  next()
})

const Booking = mongoose.model<IBooking>('Booking', BookingSchema)

export default Booking
