import mongoose from 'mongoose'

export interface ISlot {
  room: mongoose.Schema.Types.ObjectId
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export interface ISlotResponse {
  success: boolean
  statusCode: number
  message: string
  data?: ISlot[]
}
