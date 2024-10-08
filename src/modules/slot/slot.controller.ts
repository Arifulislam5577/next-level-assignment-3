import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import {
  createSlotService,
  deleteSlotService,
  getAvailableSlotsService,
  getSlotsByRoomIdService,
  updateSlotService
} from './slot.service'

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

// ROUTE : /api/slots/:id
// METHOD : DELETE

const slotDelete = catchAsync(async (req: Request, res: Response) => {
  const data = await deleteSlotService(req.params.id)
  res.status(data.statusCode).json(data)
})

// ROUTE : /api/slots/:id
// METHOD : PUT

const slotUpdate = catchAsync(async (req: Request, res: Response) => {
  const data = await updateSlotService(req.params.id, req.body)
  res.status(data.statusCode).json(data)
})

// ROUTE : /api/slots/:id
// METHOD : GET

const slotByRoomId = catchAsync(async (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.query
  const data = await getSlotsByRoomIdService(req.params.id, {
    date: date as string,
    startTime: startTime as string,
    endTime: endTime as string
  })
  res.status(data.statusCode).json(data)
})

export const slotControllers = { createSlots, slotAvailability, slotDelete, slotUpdate, slotByRoomId }
