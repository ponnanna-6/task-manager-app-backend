const express = require('express')

const router = express.Router()

router.get('/', (req, res)=>{
    res.send("HELLO FROM TASK MANGER BACKEND")
})

module.exports = router