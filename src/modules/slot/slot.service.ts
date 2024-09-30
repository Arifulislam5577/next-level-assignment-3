import { ISlot, ISlotResponse } from './slot.interface'
import Slot from './slot.model'

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

const createSlotService = async (slotData: ISlot): Promise<ISlotResponse> => {
  const { room, date, startTime, endTime } = slotData

  const slotDuration = 60
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)

  const totalDuration = endMinutes - startMinutes
  const numberOfSlots = totalDuration / slotDuration

  if (totalDuration <= 0) {
    return {
      success: false,
      statusCode: 400,
      message: 'Start time should be less than end time'
    }
  }

  const slots = []
  for (let i = 0; i < numberOfSlots; i++) {
    const slotStartTime = startMinutes + i * slotDuration
    const slotEndTime = slotStartTime + slotDuration

    const newSlot = new Slot({
      room,
      date,
      startTime: minutesToTime(slotStartTime),
      endTime: minutesToTime(slotEndTime),
      isBooked: false
    })

    const isSlotExists = await Slot.findOne({
      $and: [{ room }, { date }, { startTime: newSlot.startTime }, { endTime: newSlot.endTime }]
    })

    if (isSlotExists) {
      return {
        success: false,
        statusCode: 400,
        message: `Slot already exists for ${newSlot.startTime} to ${newSlot.endTime}`
      }
    } else {
      await newSlot.save()
      slots.push(newSlot)
    }
  }

  return {
    success: true,
    statusCode: 200,
    message: 'Slots created successfully',
    data: slots
  }
}

const getAvailableSlotsService = async (date: string, roomId: string): Promise<ISlotResponse> => {
  let query = {}

  if (date && roomId) {
    query = { $and: [{ date }, { room: roomId }, { isBooked: false }] }
  } else {
    query = { isBooked: false }
  }

  const slots = await Slot.find(query).populate('room')

  if (slots.length <= 0) {
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
      message: 'Available slots retrieved successfully',
      data: slots
    }
  }
}

const deleteSlotService = async (slotId: string): Promise<ISlotResponse> => {
  const slot = await Slot.findByIdAndDelete(slotId)
  if (!slot) {
    return {
      success: false,
      statusCode: 404,
      message: 'Slot not found'
    }
  } else {
    return {
      success: true,
      statusCode: 200,
      message: 'Slot deleted successfully'
    }
  }
}

const updateSlotService = async (slotId: string, slotData: ISlot): Promise<ISlotResponse> => {
  const slot = await Slot.findByIdAndUpdate(slotId, slotData, { new: true })
  if (!slot) {
    return {
      success: false,
      statusCode: 404,
      message: 'Slot not found'
    }
  } else {
    return {
      success: true,
      statusCode: 200,
      message: 'Slot updated successfully'
    }
  }
}

const getSlotsByRoomIdService = async (
  roomId: string,
  queryValue: { date: string; startTime: string; endTime: string }
): Promise<ISlotResponse> => {
  const { date, startTime, endTime } = queryValue
  let query = {}

  if (!date && !startTime && !endTime) {
    query = { room: roomId }
  }

  if (date && startTime && endTime) {
    query = {
      $and: [{ room: roomId }, { date }, { startTime }, { endTime }]
    }
  }

  const slots = await Slot.find(query).populate('room', ['name', 'pricePerSlot'])

  return {
    success: true,
    statusCode: 200,
    message: 'Slots retrieved successfully',
    data: slots
  }
}

export { createSlotService, deleteSlotService, getAvailableSlotsService, getSlotsByRoomIdService, updateSlotService }
