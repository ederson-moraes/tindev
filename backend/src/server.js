const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://192.168.1.161:3000',
        methods: ['GET', 'POST'],
    }
})

const connectedUsers = {}

io.on('connection', (socket) => {
    const { user } = socket.handshake.query

    console.log(`User connected: ${user}` + ` Socket ID: ${socket.id}`)

    connectedUsers[user] = socket.id
})

const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log(err)
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    return next()
}
)

app.use(cors())
app.use(express.json())
app.use(routes)


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})