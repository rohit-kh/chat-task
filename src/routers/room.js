const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Room = require('../models/room')


router.get('/apis/rooms', auth, async (req, res) => {
	try{
		const rooms = await Room.find()
		res.status(201).send({rooms})
	}catch (e){
		res.status(400).send(e)
	}
})


router.get('/chat', auth, async (req, res) => {
	const rooms = await Room.find()
	res.render('chat', {
        title: 'Select Room',
		rooms: rooms,
        name: 'Rohit Khatri'
    })
})



module.exports = router