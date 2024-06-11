import mongoose from 'mongoose'
import app from './app'
import config from './config'

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
    console.log(error)
    throw new Error('Internal Server Error')
  }
}

startServer()
