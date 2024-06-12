import express from 'express'
import { ZodValidation } from '../../middleware/ZodValidation'
import { authControllers } from './user.controller'
import { createUserZodSchema, loginUserZodSchema } from './user.validation'

const router = express.Router()

router.route('/signup').post(ZodValidation(createUserZodSchema), authControllers.signup)
router.route('/login').post(ZodValidation(loginUserZodSchema), authControllers.login)

export default router
