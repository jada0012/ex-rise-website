require('dotenv').config()
const PORT = process.env.PORT || 3500
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { logger} = require('./middleware/logEvents')
const connectDB = require('./config/dbConn')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
connectDB()

app.use(logger)
app.use(credentials)
app.use(cors(corsOptions))
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//     preflightContinue: true,
//     optionsSuccessStatus: 200
// })) //cross origin resource sharing

app.use(express.json())
app.use(cookieParser())

app.use('/register', require('./routes/api/users'))
app.use('/login', require('./routes/login'))
app.use('/refreshh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
app.use('/test', require('./routes/test'))

app.use('/posts', require('./routes/api/posts'))


mongoose.connection.once('open', ()=>{
    console.log('mongodb works')
    app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))

    
})