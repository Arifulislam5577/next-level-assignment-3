import express from 'express'
import { ZodValidation } from '../../middleware/ZodValidation'
import { auth } from '../../middleware/auth'
import { roomControllers } from './room.controller'
import { createRoomZodSchema } from './room.validation'

const router = express.Router()

router
  .route('/:id')
  .delete(auth('admin'), roomControllers.deleteRoom)
  .put(auth('admin'), roomControllers.updateRoomInfo)
  .get(roomControllers.getRoom)
router
  .route('/')
  .get(roomControllers.getAllRoom)
  .post(ZodValidation(createRoomZodSchema), auth('admin'), roomControllers.createRoom)

export default router
