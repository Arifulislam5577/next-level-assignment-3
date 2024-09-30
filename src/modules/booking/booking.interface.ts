import { Schema } from 'mongoose'

export interface IBooking {
  date: string
  slot: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  totalAmount: number
  isConfirmed: 'unconfirmed' | 'confirmed' | 'cancelled'
  isDeleted: boolean
}

export interface IBookingResponse {
  success: boolean
  statusCode: number
  message: string
  data?: IBooking | IBooking[] | []
}

export interface IPaymentResponse {
  success: boolean
  statusCode: number
  message: string
  stripeUrl: string
}
