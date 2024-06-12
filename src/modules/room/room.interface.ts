export interface TRoom {
  name: string
  roomNo: number
  floorNo: number
  capacity: number
  pricePerSlot: number
  amenities: string[]
  isDeleted: boolean
}

export interface TRoomResponse {
  success: boolean
  statusCode: number
  message: string
  data?: TRoom | [] | TRoom[]
}
