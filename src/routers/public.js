const express = require('express')
const checkAuth = require('../middleware/check-auth')
const router = new express.Router()

router.get('/signup', checkAuth, (req, res) => {
    res.render('register', {
        title: 'Registration Form',
        name: 'Rohit Khatri'
    })
})

router.get('/login', checkAuth, (req, res) => {
    res.render('login', {
        title: 'Login Form',
        name: 'Rohit Khatri'
    })
})

router.get('/', (req, res) => {
    res.redirect('/login')
})

module.exports = router