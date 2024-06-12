import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './global/globalError'
import authRouter from './modules/user/user.route'

const app: Application = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json('Hello World!')
})

// API Routes

app.use('/api/auth', authRouter)

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`
  })
})

app.use(globalErrorHandler)

export default app
