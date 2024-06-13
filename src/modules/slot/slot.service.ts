import Room from '../room/room.model'
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
  try {
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

    const isRoomExists = await Room.findById(room)
    if (!isRoomExists) {
      return {
        success: false,
        statusCode: 404,
        message: 'Room not found'
      }
    } else {
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
  } catch (error: any) {
    throw new Error(error)
  }
}

const getAvailableSlotsService = async (date: string, roomId: string): Promise<ISlotResponse> => {
  try {
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
  } catch (error: any) {
    throw new Error(error)
  }
}

export { createSlotService, getAvailableSlotsService }
