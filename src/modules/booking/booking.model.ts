import mongoose, { Model, Schema } from 'mongoose'
import { IBooking } from './booking.interface'

const BookingSchema: Schema<IBooking> = new Schema<IBooking>(
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

const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema)

export default Booking
