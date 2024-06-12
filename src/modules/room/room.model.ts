import mongoose, { Schema } from 'mongoose'
import { TRoom } from './room.interface'

const RoomSchema = new Schema<TRoom>(
  {
    name: { type: String, required: [true, 'Room Name is required'] },
    roomNo: { type: Number, required: [true, 'Room Number is required'] },
    floorNo: { type: Number, required: [true, 'Floor Number is required'] },
    capacity: { type: Number, required: [true, 'Capacity is required'] },
    pricePerSlot: { type: Number, required: [true, 'Price Per Slot is required'] },
    amenities: {
      type: [
        {
          type: String
        }
      ],
      required: [true, 'Amenities is required']
    },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

const Room = mongoose.model<TRoom>('Room', RoomSchema)

export default Room
