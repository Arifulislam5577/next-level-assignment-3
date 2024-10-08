import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './middleware/globalErrorHandler'
import bookingRouter from './modules/booking/booking.route'
import roomRouter from './modules/room/room.route'
import slotRouter from './modules/slot/slot.route'
import authRouter from './modules/user/user.route'

const app: Application = express()

app.use(cors({ origin: ['http://localhost:5173', 'https://roomly-cyan.vercel.app'], credentials: true }))
app.use(express.json({ limit: '5mb' }))
app.get('/', (req: Request, res: Response) => {
  res.json('API working')
})

// API Routes

app.use('/api/auth', authRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/slots', slotRouter)
app.use('/api', bookingRouter)

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found'
  })
})

app.use(globalErrorHandler)

export default app
