import Room from '../room/room.model'
import Slot from '../slot/slot.model'
import { IBooking, IBookingResponse } from './booking.interface'
import Booking from './booking.model'

const createBookingService = async (bookingData: IBooking): Promise<IBookingResponse> => {
  const { date, slots, room, user } = bookingData

  const roomDetails = await Room.findById(room).select('pricePerSlot')

  if (!roomDetails) {
    return {
      success: true,
      statusCode: 404,
      message: 'Room Not Found'
    }
  }

  const totalAmount = roomDetails.pricePerSlot * slots.length
  const newBooking = new Booking({ date, slots, room, user, totalAmount })
  await newBooking.save()

  await Slot.updateMany({ _id: { $in: bookingData.slots } }, { isBooked: true })
  const bookings = await newBooking.populate('room user slots')

  return {
    success: true,
    statusCode: 201,
    message: 'Booking created successfully',
    data: bookings
  }
}

const getBookingService = async (): Promise<IBookingResponse> => {
  const booking = await Booking.find().populate('room user slots')
  if (!booking) {
    return {
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: []
    }
  }
  return {
    success: true,
    statusCode: 200,
    message: 'Booking retrieved successfully',
    data: booking
  }
}

const getUserBookingService = async (userId: string): Promise<IBookingResponse> => {
  const booking = await Booking.find({ user: userId }).populate('slots room').select('-user')

  if (!booking) {
    return {
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: []
    }
  }
  return {
    success: true,
    statusCode: 200,
    message: 'User bookings retrieved successfully',
    data: booking
  }
}

const updateBookingService = async (bookingId: string, bookingData: IBooking): Promise<IBookingResponse> => {
  const booking = await Booking.findByIdAndUpdate(bookingId, bookingData, { new: true })
  if (!booking) {
    return {
      success: false,
      statusCode: 404,
      message: 'Booking not found'
    }
  }
  return {
    success: true,
    statusCode: 200,
    message: 'Booking updated successfully',
    data: booking
  }
}

const deleteBookingService = async (bookingId: string): Promise<IBookingResponse> => {
  const isBookingDeleted = await Booking.findById(bookingId)

  if (isBookingDeleted?.isDeleted) {
    return {
      success: false,
      statusCode: 400,
      message: 'Booking already deleted'
    }
  }

  const booking = await Booking.findByIdAndUpdate(bookingId, { isDeleted: true }, { new: true })

  if (!booking) {
    return {
      success: false,
      statusCode: 404,
      message: 'Booking not found'
    }
  }
  return {
    success: true,
    statusCode: 200,
    message: 'Booking deleted successfully',
    data: booking
  }
}

export { createBookingService, deleteBookingService, getBookingService, getUserBookingService, updateBookingService }
