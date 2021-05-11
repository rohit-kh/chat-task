const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/apis/users', async (req, res) => {
	try{
		const user = new User(req.body)
		await user.save()
		res.status(201).send({status: true})
	}catch (e){
		res.status(400).send(e)
	}
})


router.post('/apis/users/logout', auth, async (req, res) => {
	try{
		req.user.tokens = []
		await req.user.save()
		res.clearCookie('jwtToken').send({status: true})
	} catch(e) {
		res.status(500).send({status: false})
	}
})

router.post('/apis/users/login', async (req, res) => {
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		res.cookie('jwtToken', token).send({user, token})
	}catch (e){
		res.status(500).send(e)
	}
})

module.exports = router