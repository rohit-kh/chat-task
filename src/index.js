const express = require('express')
const path = require('path')
const hbs = require('hbs')
const http = require('http')
const socketAuth = require('./middleware/socket-auth')
const socketio = require('socket.io')
const Message = require('./models/message')
const cookieParser = require('cookie-parser');
require('./db/mongoose')
const userRouter = require('./routers/user')
const roomRouter = require('./routers/room')
const publicRouter = require('./routers/public')
const { ObjectId } = require('bson')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(cookieParser())
app.use(userRouter)
app.use(roomRouter)
app.use(publicRouter)


io.use( async (socket, next) => {
    try{
        await socketAuth(socket)
        next();
    }catch (e){
        next(new Error('Error'))
    }
});
  

io.on('connection', async (socket) => {
    const user = socket.user
    const token = socket.token
    console.log('New WebSocket connection')
    socket.on('join', async (options, callback) => {
        console.log('Joined')
        socket.join(options.room)
        user.room = options.room
        // socket.emit('message', {
        //     username: user.name,
        //     text: 'Welcome!',
        //     createdAt: new Date().getTime()
        // })
        
        const currentRoomMessages = await Message.find({
            roomId: user.room
        })
        .sort({ createdAt: 1 })
        .populate('sentBy').exec()
        console.log(currentRoomMessages, 1111)

        io.to(user.room).emit('currentRoomMessages', {
            room: user.room,
            data:currentRoomMessages
        })

		// socket.emit('message', 'Joined')
        socket.broadcast.to(user.room).emit('message', `${user.name} has joined!`)
        // io.to(user.room).emit('roomData', {
        //     room: user.room,
        //     // users: getUsersInRoom(user.room)
        // })

        callback()
    })

    socket.on('sendMessage', async (data, callback) => {
        const message = new Message({roomId: user.room, sentBy: user._id, data: data})
        
        await message.save().then(t => t.populate('sentBy').execPopulate())
        
        // const recentMsg = await Message.find({
        //     _id: message._id
        // }).populate('sentBy').exec()
        // console.log(recentMsg)
        io.to(user.room).emit('message', 
        message)
        callback()
    })

    socket.on('disconnect', () => {
        if (user) {
            io.to(user.room).emit('message', 
            {
                username: user.name,
                text: `${user.name} has left!`,
                createdAt: new Date().getTime()
            })

            // io.to(user.room).emit('roomData', {
            //     room: user.room,
            //     users: getUsersInRoom(user.room)
            // })
        }
    })
})

server.listen(process.env.PORT, () => {
	console.log('Server is up on port ' + process.env.PORT)
})

