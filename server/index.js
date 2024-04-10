// Sat April 6 2024 20:13 (Nepal)

const express = require('express');
const app = express()

const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const database = require('./connectDB')
const router = require('./router/router')



app.use(express.json())
app.use(cors())
app.use('/api',router)


app.get('/',(req,res)=>{
    res.send("Hello Users!!")
})


app.listen(4000,()=>{
    console.log("Server is running on port 4000")
})

