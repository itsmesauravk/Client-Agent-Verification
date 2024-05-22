// Sat April 6 2024 20:13 (Nepal)  ==first type

// Wed May 22 2024 11:05 PM (Nepal)  ==second type

const express = require('express');
const app = express()

const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')

const passport = require('passport')

const passportSetup = require('./passport')
const authRoute = require('./router/auth')
const database = require('./connectDB')
const router = require('./router/router')
const cookRouter = require('./router/cookRouter')



app.use(cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 60 * 100
}))
app.use(cookieParser())
app.use(express.json())

app.use(cors(
    {
        origin: 'http://localhost:3000',
        methods: ['GET','POST','PUT','DELETE','PATCH'],
        credentials: true
    }
))

app.use('/auth',authRoute)

//for google auth 
app.use(passport.initialize())
app.use(passport.session())


app.use('/api',router)
app.use('/auth-cook',cookRouter)



app.get('/',(req,res)=>{
    res.send("Hello Users!!")
})


app.listen(4000,()=>{
    console.log("Server is running on port 4000")
})

