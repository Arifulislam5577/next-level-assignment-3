import { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import { ZodError, ZodIssue } from 'zod'
import AppError from './AppError'

type ErrorDetails = {
  path: string | number
  message: string
}

// Handle Cast Error
const handleCastError = (err: mongoose.Error.CastError): ErrorDetails[] => {
  return [
    {
      path: err.path,
      message: `Invalid ${err.path}: ${err.value}`
    }
  ]
}
// Handle Zod Error
const handleZodError = (error: ZodError) => {
  return error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message
    }
  })
}

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let status: number = err.statusCode || 500
  let message: string = err.message || 'Something went wrong'
  let errorMessages: ErrorDetails[] = []

  if (err instanceof ZodError) {
    status = 400
    message = 'Validation Error'
    errorMessages = handleZodError(err)
  } else if (err instanceof Error) {
    message = err.message
    errorMessages = [{ path: '', message: err.message }]
  } else if (err instanceof AppError) {
    status = err.statusCode
    message = err.message
    errorMessages = [{ path: '', message: err.message }]
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400
    message = 'Invalid Mongo ID'
    errorMessages = handleCastError(err)
  } else if (err.code === 11000) {
    status = 400
    message = err.message
    errorMessages = [{ path: '', message: err.message }]
  }
  return res.status(status).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === 'DEVELOPMENT' ? err.stack : null
  })
}

export default globalErrorHandler
