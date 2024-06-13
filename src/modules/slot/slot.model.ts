import mongoose, { Schema } from 'mongoose'
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

const Slot = mongoose.model<ISlot>('Slot', SlotSchema)

export default Slot
