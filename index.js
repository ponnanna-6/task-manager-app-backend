const express = require('express')
const dotenv = require('dotenv')
const { default: mongoose } = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const publicRouter = require('./routes/public')
const acessRouter = require('./routes/access')

dotenv.config()
const app = express()

//middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//routes
app.use('/api/v1/', indexRouter)
app.use('/api/v1/user/', userRouter)
app.use('/api/v1/task/', taskRouter)
app.use('/api/v1/access/', acessRouter)

app.use('/api/v2/public/', publicRouter)

app.listen(process.env.PORT, (req, res)=>{
    console.log(`Server started on port ${process.env.PORT}`)
    mongoose.connect(process.env.MONGOOSE_URI_STRING).then(()=>{
        console.log("Connected to: ", process.env.MONGOOSE_URI_STRING)
    }).catch((error)=>{
        console.log("DB connection error", error)
    })
})