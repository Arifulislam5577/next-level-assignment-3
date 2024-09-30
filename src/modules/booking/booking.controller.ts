import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import {
  createBookingService,
  deleteBookingService,
  getBookingService,
  getUserBookingService,
  paymentService,
  updateBookingService
} from './booking.service'

// ROUTE : /api/booking
// METHOD : GET

const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const bookings = await getBookingService()
  res.status(bookings.statusCode).json(bookings)
})

// ROUTE : /api/booking
// METHOD : POST

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { userId, slotId } = req.body
  const data = await createBookingService({ userId, slotId })
  res.status(data.statusCode).json(data)
})

// ROUTE : /api/my-booking
// METHOD : GET

const userBooking = catchAsync(async (req: Request, res: Response) => {
  const { user } = req.user
  const data = await getUserBookingService(user.id)
  res.status(data.statusCode).json(data)
})

// ROUTE : /api/bookings/:id
// METHOD : PUT

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const data = await updateBookingService(req.params.id, req.body)
  res.status(data.statusCode).json(data)
})

// ROUTE : /api/bookings/:id
// METHOD : DELETE

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const data = await deleteBookingService(req.params.id)
  res.status(data.statusCode).json(data)
})
// ROUTE : /api/bookings/payment
// METHOD : POST

const paymentBooking = catchAsync(async (req: Request, res: Response) => {
  const { slotId, userId } = req.body
  const infos = {
    userId,
    slotId
  }
  const data = await paymentService(infos)
  res.status(data.statusCode).json(data)
})

export const bookingControllers = {
  createBooking,
  getAllBooking,
  userBooking,
  updateBooking,
  deleteBooking,
  paymentBooking
}
