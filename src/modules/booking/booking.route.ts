import express from 'express'
import { auth } from '../../middleware/auth'
import { bookingControllers } from './booking.controller'

const router = express.Router()

router.route('/payment').post(auth('user'), bookingControllers.paymentBooking)

router
  .route('/bookings')
  .get(auth('admin'), bookingControllers.getAllBooking)
  .post(auth('user'), bookingControllers.createBooking)

router
  .route('/bookings/:id')
  .put(auth('admin'), bookingControllers.updateBooking)
  .delete(auth('admin'), bookingControllers.deleteBooking)
router.route('/my-booking').get(auth('user'), bookingControllers.userBooking)

export default router
