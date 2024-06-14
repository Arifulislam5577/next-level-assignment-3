import Slot from '../slot/slot.model'
import { IRoom, IRoomResponse } from './room.interface'
import Room from './room.model'

const createRoomService = async (roomData: IRoom): Promise<IRoomResponse> => {
  const isRoomExists = await Room.findOne({
    $and: [{ roomNo: roomData.roomNo }, { floorNo: roomData.floorNo }]
  })

  if (isRoomExists) {
    return {
      success: false,
      statusCode: 400,
      message: 'Room already exists'
    }
  } else {
    const room = await Room.create({ ...roomData })
    return {
      success: true,
      statusCode: 201,
      message: 'Room added successfully',
      data: room
    }
  }
}

const updateRoomService = async (roomId: string, roomData: IRoom): Promise<IRoomResponse> => {
  const room = await Room.findByIdAndUpdate(roomId, roomData, { new: true })

  if (!room) {
    return {
      success: false,
      statusCode: 404,
      message: 'Room does not exists'
    }
  } else {
    return {
      success: true,
      statusCode: 200,
      message: 'Room updated successfully',
      data: room
    }
  }
}

const deleteRoomService = async (roomId: string): Promise<IRoomResponse> => {
  const room = await Room.findByIdAndUpdate(roomId, { isDeleted: true }, { new: true })
  if (!room) {
    return {
      success: false,
      statusCode: 404,
      message: 'Room does not exists'
    }
  } else {
    await Slot.deleteMany({ room: roomId })

    return {
      success: true,
      statusCode: 200,
      message: 'Room deleted successfully',
      data: room
    }
  }
}

const getAllRoomService = async (): Promise<IRoomResponse> => {
  const rooms = await Room.find()

  if (rooms.length <= 0) {
    return {
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: []
    }
  } else {
    return {
      success: true,
      statusCode: 200,
      message: 'Room retrieved successfully',
      data: rooms
    }
  }
}
export { createRoomService, deleteRoomService, getAllRoomService, updateRoomService }
