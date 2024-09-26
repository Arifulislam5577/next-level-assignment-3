import { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import { ZodError, ZodIssue } from 'zod'
import AppError from '../global/AppError'

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
  let errorSource: ErrorDetails[] = []

  if (err instanceof ZodError) {
    const zodError = handleZodError(err)
    status = 400
    message = zodError[0].message
    errorSource = handleZodError(err)
  } else if (err instanceof AppError) {
    status = err.statusCode
    message = err.message
    errorSource = [{ path: '', message: err.message }]
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400
    message = err.message
    errorSource = handleCastError(err)
  } else if (err.code === 11000) {
    status = 400
    message = err.message
    errorSource = [{ path: '', message: err.message }]
  } else if (err instanceof Error) {
    message = err.message
    errorSource = [{ path: '', message: err.message }]
  }
  return res.status(status).json({
    success: false,
    message,
    errorSource,
    stack: process.env.NODE_ENV === 'DEVELOPMENT' ? err.stack : null
  })
}

export default globalErrorHandler
