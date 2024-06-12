import mongoose from 'mongoose'
import app from './app'
import config from './config'
import AppError from './global/AppError'

async function startServer() {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(config.DATABASE_URL!)
    app.listen(config.PORT, () => {
      if (config.NODE_ENV === 'DEVELOPMENT') {
        console.log(`App listening on port ${config.PORT}`)
      }
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.message, 400)
    } else {
      throw new Error('Internal Server Error')
    }
  }
}

startServer()
