export interface IRoom {
  name: string
  image: string
  roomNo: number
  floorNo: number
  capacity: number
  pricePerSlot: number
  amenities: string[]
  isDeleted: boolean
}

export interface IRoomResponse {
  success: boolean
  statusCode: number
  message: string
  data?: IRoom | [] | IRoom[]
}
