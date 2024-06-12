import mongoose, { Schema } from 'mongoose'
import { TSlot } from './slot.interface'

const SlotSchema = new Schema<TSlot>(
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
  const startTime = this.startTime
  const endTime = this.endTime

  if (+startTime >= +endTime) {
    next(new Error('Start time should be less than end time'))
  }
  next()
})

const Slot = mongoose.model<TSlot>('Slot', SlotSchema)

export default Slot
