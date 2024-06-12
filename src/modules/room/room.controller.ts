import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import Room from './room.model'
import { createRoomService, deleteRoomService, getAllRoomService, updateRoomService } from './room.service'

// ROUTE : /api/rooms
// METHOD : POST

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const data = await createRoomService(req.body)
  res.status(data.statusCode).json(data)
})

// ROUTE : /api/rooms:id
// METHOD : GET

const getRoom = catchAsync(async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id)

  if (!room) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Room not found',
      data: null
    })
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Room retrieved successfully',
    data: room
  })
})

// ROUTE : /api/rooms
// METHOD : GET

const getAllRoom = catchAsync(async (req: Request, res: Response) => {
  const rooms = await getAllRoomService()
  res.status(rooms.statusCode).json(rooms)
})

// ROUTE : /api/rooms/:id
// METHOD : PUT

const updateRoomInfo = catchAsync(async (req: Request, res: Response) => {
  const rooms = await updateRoomService(req.params.id, req.body)
  res.status(rooms.statusCode).json(rooms)
})

// ROUTE : /api/rooms/:id
// METHOD : PUT

const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const rooms = await deleteRoomService(req.params.id)
  res.status(rooms.statusCode).json(rooms)
})

export const roomControllers = { createRoom, getRoom, getAllRoom, updateRoomInfo, deleteRoom }
