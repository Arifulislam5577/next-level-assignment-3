import mongoose from 'mongoose'
import { z } from 'zod'

const createSlotSchema = z.object({
  room: z.string({ required_error: 'Room Id is required' }).refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid Room Id'
  }),
  date: z.string({ required_error: 'Date is required' }),
  startTime: z.string({ required_error: 'StartTime is required' }),
  endTime: z.string({ required_error: 'EndTime is required' }),
  isBooked: z.boolean().default(false).optional()
})

export { createSlotSchema }
