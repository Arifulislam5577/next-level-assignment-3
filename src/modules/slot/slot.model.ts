import mongoose, { Schema } from 'mongoose'
import AppError from '../../global/AppError'
import Room from '../room/room.model'
import { ISlot } from './slot.interface'

const SlotSchema = new Schema<ISlot>(
  {
    room: { type: Schema.Types.ObjectId, required: [true, 'Room Id is required'], ref: 'Room' },
    date: { type: String, required: [true, 'Date is required'] },
    startTime: { type: String, required: [true, 'StartTime is required'] },
    endTime: { type: String, required: [true, 'EndTime is required'] },
    isBooked: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

SlotSchema.pre('save', async function (next) {
  const isRoomExists = await Room.findById(this.room)

  if (!isRoomExists) {
    throw new AppError('Room not found', 404)
  } else if (isRoomExists.isDeleted) {
    throw new AppError('Room already deleted', 400)
  } else {
    next()
  }
})

const Slot = mongoose.model<ISlot>('Slot', SlotSchema)

export default Slot
