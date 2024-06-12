import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './global/globalError'
import roomRouter from './modules/room/room.route'
import authRouter from './modules/user/user.route'

const app: Application = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json('Hello World!')
})

// API Routes

app.use('/api/auth', authRouter)
app.use('/api/rooms', roomRouter)

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found'
  })
})

app.use(globalErrorHandler)

export default app
