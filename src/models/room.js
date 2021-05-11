const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
},
{
    timestamps: true
})

roomSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'roomId'
})


const Room = mongoose.model('Room', roomSchema)

module.exports = Room