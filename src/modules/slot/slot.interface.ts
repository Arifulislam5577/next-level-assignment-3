import mongoose from 'mongoose'

export interface TSlot {
  room: mongoose.Schema.Types.ObjectId
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export interface TSlotResponse {
  success: boolean
  statusCode: number
  message: string
  data?: TSlot[]
}
