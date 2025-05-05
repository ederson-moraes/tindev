const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const server = express()

const dotenv = require('dotenv')
dotenv.config()

server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header('Access-Control-Allow-Headers', 'user, Content-Type')
    next()
})

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log(err)
})

server.use(express.json())
server.use(routes)


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})