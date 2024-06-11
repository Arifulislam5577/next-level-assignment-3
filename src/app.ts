import express, { Application, Request, Response } from 'express'

const app: Application = express()

app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  res.json('Hello World!')
})

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

export default app
