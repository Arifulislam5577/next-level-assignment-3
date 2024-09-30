import Stripe from 'stripe'
import config from '../../config'
import Room from '../room/room.model'
import Slot from '../slot/slot.model'
import User from '../user/user.model'
import { IBooking, IBookingResponse, IPaymentResponse } from './booking.interface'
import Booking from './booking.model'
const stripe = new Stripe(config.STRIPE_SECRET_KEY!)

const createBookingService = async ({
  userId,
  slotId
}: {
  userId: string
  slotId: string
}): Promise<IBookingResponse> => {
  const slot = await Slot.findById(slotId)
  const user = await User.findById(userId)
  const room = await Room.findById(slot?.room)
  const totalAmount = room?.pricePerSlot ?? 0

  const isSlotIsBooked = await Slot.findOne({ _id: slotId, room: room?._id, isBooked: false })

  if (!isSlotIsBooked) {
    return {
      success: false,
      statusCode: 400,
      message: 'The slot is already booked or does not exist'
    }
  }

  const booking = await Booking.create({
    date: slot?.date,
    slot: slotId,
    room: room?._id,
    user: user?._id,
    totalAmount
  })

  await Slot.findByIdAndUpdate(slotId, { isBooked: true }, { new: true })

  const populatedBooking = await Booking.findById(booking._id)
    .populate('user', 'name email')
    .populate('room', 'name pricePerSlot')
    .populate('slot', 'startTime endTime')

  if (!populatedBooking) {
    return {
      success: false,
      statusCode: 404,
      message: 'Booking not found after creation'
    }
  }

  return {
    success: true,
    statusCode: 201,
    message: 'Booking created successfully',
    data: populatedBooking
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

const paymentService = async ({ userId, slotId }: { userId: string; slotId: string }): Promise<IPaymentResponse> => {
  const slot = await Slot.findById(slotId).populate('room')
  const user = await User.findById(userId)
  const room = await Room.findById(slot?.room)

  const pricePerSlot = room?.pricePerSlot ?? 0
  const totalAmount = pricePerSlot * 100
  const roomName = room?.name ?? ''
  const roomImage = room?.image ?? ''

  const customer = await stripe.customers.create({
    email: user?.email,
    metadata: {
      orderInfo: JSON.stringify({
        email: user?.email,
        name: user?.name,
        roomName,
        roomImage
      })
    }
  })

  const session: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: roomName,
            images: [roomImage]
          },
          unit_amount: totalAmount
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `http://localhost:5173/success?slot_id=${slot?._id}&user_id=${user?._id}`,
    cancel_url: 'http://localhost:5173/cancel',
    customer: customer.id
  })

  return {
    success: true,
    statusCode: 200,
    message: 'Payment link send successfully',
    stripeUrl: session.url!
  }
}
export {
  createBookingService,
  deleteBookingService,
  getBookingService,
  getUserBookingService,
  paymentService,
  updateBookingService
}
