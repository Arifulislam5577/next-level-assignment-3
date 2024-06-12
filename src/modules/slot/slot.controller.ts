import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { createSlotService, getAvailableSlotsService } from './slot.service'

// ROUTE : /api/slots
// METHOD : POST

const createSlots = catchAsync(async (req: Request, res: Response) => {
  const data = await createSlotService(req.body)
  res.status(data.statusCode).json(data)
})

// ROUTE : /api/slots/availability
// METHOD : GET

const slotAvailability = catchAsync(async (req: Request, res: Response) => {
  const { date, roomId } = req.query
  const data = await getAvailableSlotsService(date as string, roomId as string)
  res.status(data.statusCode).json(data)
})

export const slotControllers = { createSlots, slotAvailability }
