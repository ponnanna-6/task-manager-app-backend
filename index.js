const express = require('express')
const dotenv = require('dotenv')
const { default: mongoose } = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config()
const app = express()

app.listen(process.env.PORT, (req, res)=>{
    console.log(`Server started on port ${process.env.PORT}`)
    mongoose.connect(process.env.MONGOOSE_URI_STRING).then(()=>{
        console.log("Connected to: ", process.env.MONGOOSE_URI_STRING)
    }).catch((error)=>{
        console.log("DB connection error", error)
    })
})