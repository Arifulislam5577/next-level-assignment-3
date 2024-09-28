import { z } from 'zod'

const createRoomZodSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  image: z.string({ required_error: 'Image is required' }),
  roomNo: z
    .number({ required_error: 'Room number is required' })
    .int({ message: 'Room number must be an integer' })
    .nonnegative({ message: 'Room number must be a non-negative integer' }),
  floorNo: z
    .number({ required_error: 'floor number is required' })
    .int({ message: 'Floor number must be an integer' })
    .nonnegative({ message: 'Floor number must be a non-negative integer' }),
  capacity: z
    .number({ required_error: 'Capacity is required' })
    .int({ message: 'Capacity must be an integer' })
    .positive({ message: 'Capacity must be a positive integer' }),
  pricePerSlot: z
    .number({ required_error: 'Price per slot is required' })
    .positive({ message: 'Price per slot must be a positive number' }),
  amenities: z
    .array(z.string({ required_error: 'Amenity cannot be an empty string' }), {
      message: 'Amenities must be an array of strings'
    })
    .nonempty({ message: 'Amenities are required' }),
  isDeleted: z.boolean().optional()
})

export { createRoomZodSchema }
