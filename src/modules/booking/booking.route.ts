import express from 'express'
import { ZodValidation } from '../../middleware/ZodValidation'
import { auth } from '../../middleware/auth'
import { bookingControllers } from './booking.controller'
import { createBookingZodSchema } from './booking.validation'

const router = express.Router()

router
  .route('/bookings')
  .get(auth('admin'), bookingControllers.getAllBooking)
  .post(ZodValidation(createBookingZodSchema), auth('user'), bookingControllers.createBooking)

router
  .route('/bookings/:id')
  .put(auth('admin'), bookingControllers.updateBooking)
  .delete(auth('admin'), bookingControllers.deleteBooking)
router.route('/my-booking').get(auth('user'), bookingControllers.userBooking)

export default router
