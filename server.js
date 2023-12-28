import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import colors from 'colors'
import { connectDB } from './config/db.js'
import router from './routes/auth.js'
import userRouter from './routes/userRoute.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 8080

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/auth', router)
app.use('/api/user', userRouter)

// connect to mongdb

connectDB()

app.listen(port, ()=> {
    console.log(` Server is running on port ${port} `.bgGreen.black)
})