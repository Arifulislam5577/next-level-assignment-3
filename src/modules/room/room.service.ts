import QueryApi from '../../query/queryApi'
import { uploadImage } from '../../utils/uploadImage'
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
  }
  const productImage = await uploadImage(roomData.image)
  const room = await Room.create({ ...roomData, image: productImage })
  return {
    success: true,
    statusCode: 201,
    message: 'Room added successfully',
    data: {
      data: room
    }
  }
}
const updateRoomService = async (roomId: string, roomData: IRoom): Promise<IRoomResponse> => {
  const cleanedData = Object.fromEntries(
    Object.entries(roomData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  )

  if (cleanedData.image) {
    cleanedData.image = await uploadImage(cleanedData.image)
  }

  const room = await Room.findByIdAndUpdate(roomId, cleanedData, { new: true })

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
      data: {
        data: room
      }
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
      data: {
        data: room
      }
    }
  }
}
const getAllRoomService = async (query: Record<string, unknown>): Promise<IRoomResponse> => {
  const roomQuery = new QueryApi(Room.find(), query).search(['name']).filter().sort().paginate().fields()

  const productData = await roomQuery.query
  const metadata = await roomQuery.countTotal()

  return {
    success: true,
    statusCode: 200,
    message: 'Room retrieved successfully',
    data: {
      data: productData,
      meta: { ...metadata }
    }
  }
}
export { createRoomService, deleteRoomService, getAllRoomService, updateRoomService }
