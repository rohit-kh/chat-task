const express = require('express')
const socketio = require('socket.io')

const checkAuth = require('../middleware/check-auth')
const router = new express.Router()

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
    socket.on('join', (options, callback) => {
        console.log('Joined', token)
        socket.join(options.room)
        user.room = options.room
        socket.emit('message', {
            username: user.name,
            text: 'Welcome!',
            createdAt: new Date().getTime()
        })
		socket.emit('message', 'Joined')
        socket.broadcast.to(options.room).emit('message', `${user.name} has joined!`)
        // io.to(options.room).emit('roomData', {
        //     room: options.room,
        //     // users: getUsersInRoom(user.room)
        // })

        callback()
    })

    socket.on('sendMessage', async (data, callback) => {
        const message = new Message({roomId: user.room, sentBy: user._id, data: data})
        
        await message.save()

        io.to(user.room).emit('message', 
        {
            username: user.name,
            text: data,
            createdAt: message.createdAt
        })
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.to(user.room).emit('locationMessage',
        {
            username: user.name,
            text: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
            createdAt: new Date().getTime()
        })
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

module.exports = router