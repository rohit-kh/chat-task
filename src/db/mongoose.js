const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useCreateIndex: true
})