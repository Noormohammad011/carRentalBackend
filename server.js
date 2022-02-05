import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'

//import middleware
import morgan from 'morgan'
import connectDB from './db/db.js'
import carRoutes from './routes/carRoutes.js'
import userRoutes from './routes/userRoutes.js'
import bookingRoutes from './routes/bookcarRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'


// load env vars
dotenv.config()

//express configuration
const app = express()

//morgan

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//connection db
connectDB()

// Body parser
app.use(express.json())

// Enable cors
app.use(cors())

//mount routes
app.use('/api/car', carRoutes)
app.use('/api/user', userRoutes)
app.use('/api/bookings', bookingRoutes)

app.use(errorHandler)
app.use(notFound)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.white.bold
  )
)
