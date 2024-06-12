import express from 'express'
import { ZodValidation } from '../../middleware/ZodValidation'
import { auth } from '../../middleware/auth'
import { slotControllers } from './slot.controller'
import { createSlotSchema } from './slot.validation'

const router = express.Router()

router.route('/availability').get(slotControllers.slotAvailability)
router.route('/').post(ZodValidation(createSlotSchema), auth('admin'), slotControllers.createSlots)

export default router
