import mongoose from 'mongoose'
import { z } from 'zod'

const createBookingZodSchema = z.object({
  date: z.string({ required_error: 'Date is required' }),
  slots: z.array(
    z.string({ required_error: 'Slot Id is required' }).refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: 'Invalid Slot Id'
    }),
    { required_error: 'Slots are required' }
  ),
  room: z.string({ required_error: 'Room Id is required' }).refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid Room Id'
  }),
  user: z.string({ required_error: 'User Id is required' }).refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid User Id'
  }),
  totalAmount: z.number().optional(),
  isConfirmed: z.enum(['unconfirmed', 'confirmed', 'cancelled']).default('unconfirmed').optional(),
  isDeleted: z.boolean().default(false).optional()
})

export { createBookingZodSchema }
